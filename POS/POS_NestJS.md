You are building a complete backend for a Restaurant & Café POS (Point of Sale) system using NestJS. Generate the ENTIRE project from scratch — fully functional, production-ready code.

## TECH STACK (MANDATORY)

- **Runtime:** Node.js with NestJS framework (latest stable)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL with TypeORM
- **Auth:** JWT (access token 30min + refresh token 7 days) with Passport.js
- **Validation:** class-validator + class-transformer
- **API Docs:** Swagger (@nestjs/swagger) auto-generated
- **Cache:** Redis (via @nestjs/cache-manager) for sessions and rate limiting
- **Rate Limiting:** @nestjs/throttler
- **Config:** @nestjs/config with .env files
- **Logging:** Winston or built-in NestJS logger
- **Testing:** Jest (unit + e2e)

## PROJECT STRUCTURE

```
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── redis.config.ts
│   └── swagger.config.ts
├── common/
│   ├── decorators/          (Roles, CurrentUser, ApiPagination)
│   ├── guards/              (JwtAuthGuard, RolesGuard)
│   ├── interceptors/        (TransformInterceptor, LoggingInterceptor)
│   ├── filters/             (HttpExceptionFilter, AllExceptionsFilter)
│   ├── pipes/               (ValidationPipe config)
│   ├── dto/                 (PaginationDto, ApiResponseDto)
│   ├── enums/               (all shared enums)
│   └── utils/               (helpers)
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/      (jwt.strategy.ts, jwt-refresh.strategy.ts)
│   │   ├── guards/          (local-auth.guard.ts)
│   │   └── dto/             (login.dto.ts, register.dto.ts, tokens.dto.ts)
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/        (user.entity.ts)
│   │   └── dto/             (create-user.dto, update-user.dto)
│   ├── shifts/
│   │   ├── shifts.module.ts
│   │   ├── shifts.controller.ts
│   │   ├── shifts.service.ts
│   │   ├── entities/        (shift.entity.ts)
│   │   └── dto/
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── entities/        (category.entity.ts)
│   │   └── dto/
│   ├── menu-items/
│   │   ├── menu-items.module.ts
│   │   ├── menu-items.controller.ts
│   │   ├── menu-items.service.ts
│   │   ├── entities/        (menu-item.entity.ts, variant.entity.ts)
│   │   └── dto/
│   ├── addons/
│   │   ├── addons.module.ts
│   │   ├── addons.controller.ts
│   │   ├── addons.service.ts
│   │   ├── entities/        (addon.entity.ts, menu-item-addon.entity.ts)
│   │   └── dto/
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── entities/        (order.entity.ts, order-item.entity.ts, order-item-addon.entity.ts, order-status-log.entity.ts)
│   │   └── dto/
│   ├── invoices/
│   │   ├── invoices.module.ts
│   │   ├── invoices.controller.ts
│   │   ├── invoices.service.ts
│   │   ├── entities/        (invoice.entity.ts, payment.entity.ts, refund.entity.ts)
│   │   └── dto/
│   ├── cash-drawer/
│   │   ├── cash-drawer.module.ts
│   │   ├── cash-drawer.controller.ts
│   │   ├── cash-drawer.service.ts
│   │   ├── entities/        (cash-drawer.entity.ts)
│   │   └── dto/
│   ├── reports/
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── dto/             (daily-report.dto.ts, weekly-report.dto.ts)
│   └── settings/
│       ├── settings.module.ts
│       ├── settings.controller.ts
│       ├── settings.service.ts
│       ├── entities/        (setting.entity.ts)
│       └── dto/
└── database/
    ├── migrations/
    └── seeds/               (default admin user, default settings)
```

## MODULE 1: AUTHENTICATION & USERS

### Roles Enum

```
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier'
}
```

### User Entity

| Field         | Type          | Notes                          |
| ------------- | ------------- | ------------------------------ |
| id            | UUID          | Primary key, auto-generated    |
| username      | string        | Unique, required               |
| email         | string        | Unique, nullable               |
| password      | string        | Hashed with bcrypt (12 rounds) |
| pin           | string        | Optional 4-6 digit PIN, hashed |
| full_name     | string        | Required                       |
| role          | UserRole enum | Default: CASHIER               |
| is_active     | boolean       | Default: true                  |
| last_login_at | timestamp     | Nullable                       |
| created_at    | timestamp     | Auto                           |
| updated_at    | timestamp     | Auto                           |
| deleted_at    | timestamp     | Soft delete                    |

### Auth Endpoints

```
POST   /api/v1/auth/login          - Login with (username + password) OR (username + pin)
POST   /api/v1/auth/refresh        - Refresh access token using refresh token
POST   /api/v1/auth/logout         - Blacklist refresh token
GET    /api/v1/auth/me             - Get current authenticated user
PATCH  /api/v1/auth/me             - Update own profile (name, email, password)
```

### Users Endpoints (Admin only)

```
GET    /api/v1/users               - List all users (paginated, filter by role, is_active)
POST   /api/v1/users               - Create new user
GET    /api/v1/users/:id           - Get user by ID
PATCH  /api/v1/users/:id           - Update user (role, is_active, reset password)
DELETE /api/v1/users/:id           - Soft delete user
```

### Auth Business Logic

- On login: validate credentials → generate access token (30min) + refresh token (7 days) → update last_login_at → return tokens + user info
- On refresh: validate refresh token → issue new access token → return it
- On logout: add refresh token to blacklist (Redis, TTL = remaining token life)
- Protect all routes with JwtAuthGuard except login and refresh
- RolesGuard checks user role against @Roles() decorator
- PIN login: same flow but validates PIN instead of password

## MODULE 2: SHIFTS

### Shift Entity

| Field        | Type          | Notes             |
| ------------ | ------------- | ----------------- |
| id           | UUID          | PK                |
| user_id      | UUID          | FK → users        |
| opening_cash | decimal(10,2) | Required on open  |
| closing_cash | decimal(10,2) | Required on close |
| status       | enum          | OPEN, CLOSED      |
| opened_at    | timestamp     | Auto on create    |
| closed_at    | timestamp     | Set on close      |
| notes        | text          | Optional          |

### Shift Endpoints

```
POST   /api/v1/shifts/open         - Open new shift (body: { opening_cash })
POST   /api/v1/shifts/close        - Close current shift (body: { closing_cash, notes })
GET    /api/v1/shifts/current       - Get current open shift for logged-in user
GET    /api/v1/shifts               - List shifts (filter: user_id, date range, status)
GET    /api/v1/shifts/:id           - Get shift details with cash drawer info
```

### Shift Business Logic

- A cashier can only have ONE open shift at a time
- Creating an order requires an open shift (enforce via guard/interceptor)
- On shift close: calculate expected cash = opening_cash + cash_payments - cash_refunds
- Return variance = actual (closing_cash) - expected

## MODULE 3: MENU (Categories, Items, Variants, Add-ons)

### Category Entity

| Field      | Type      | Notes         |
| ---------- | --------- | ------------- |
| id         | UUID      | PK            |
| name_ar    | string    | Required      |
| name_en    | string    | Required      |
| sort_order | integer   | Default: 0    |
| is_active  | boolean   | Default: true |
| created_at | timestamp | Auto          |
| updated_at | timestamp | Auto          |
| deleted_at | timestamp | Soft delete   |

### MenuItem Entity

| Field          | Type          | Notes               |
| -------------- | ------------- | ------------------- |
| id             | UUID          | PK                  |
| category_id    | UUID          | FK → categories     |
| name_ar        | string        | Required            |
| name_en        | string        | Required            |
| description_ar | string        | Nullable            |
| description_en | string        | Nullable            |
| base_price     | decimal(10,2) | Required, > 0       |
| image_url      | string        | Nullable            |
| tax_group      | string        | Default: 'standard' |
| is_active      | boolean       | Default: true       |
| sort_order     | integer       | Default: 0          |
| created_at     | timestamp     | Auto                |
| updated_at     | timestamp     | Auto                |
| deleted_at     | timestamp     | Soft delete         |

### Variant Entity

| Field            | Type          | Notes                              |
| ---------------- | ------------- | ---------------------------------- |
| id               | UUID          | PK                                 |
| menu_item_id     | UUID          | FK → menu_items                    |
| name             | string        | e.g., "Small", "Medium", "Large"   |
| price_adjustment | decimal(10,2) | Can be negative, zero, or positive |
| is_active        | boolean       | Default: true                      |

### AddOn Entity

| Field     | Type          | Notes          |
| --------- | ------------- | -------------- |
| id        | UUID          | PK             |
| name_ar   | string        | Required       |
| name_en   | string        | Required       |
| price     | decimal(10,2) | Required, >= 0 |
| is_active | boolean       | Default: true  |

### MenuItemAddOn (Join Table)

| Field        | Type | Notes           |
| ------------ | ---- | --------------- |
| menu_item_id | UUID | FK → menu_items |
| addon_id     | UUID | FK → addons     |

### Category Endpoints

```
GET    /api/v1/categories           - List all (filter: is_active, sorted by sort_order)
POST   /api/v1/categories           - Create (Admin/Manager)
GET    /api/v1/categories/:id       - Get one with its menu items
PATCH  /api/v1/categories/:id       - Update
DELETE /api/v1/categories/:id       - Soft delete (fails if has active menu items)
PATCH  /api/v1/categories/reorder   - Bulk update sort_order [{id, sort_order}]
```

### MenuItem Endpoints

```
GET    /api/v1/menu-items           - List all (filter: category_id, is_active; include variants & addons)
POST   /api/v1/menu-items           - Create with variants and addon associations
GET    /api/v1/menu-items/:id       - Get one with variants and addons
PATCH  /api/v1/menu-items/:id       - Update
DELETE /api/v1/menu-items/:id       - Soft delete
PATCH  /api/v1/menu-items/:id/availability  - Toggle is_active (quick availability switch)
```

### AddOn Endpoints

```
GET    /api/v1/addons               - List all
POST   /api/v1/addons               - Create
PATCH  /api/v1/addons/:id           - Update
DELETE /api/v1/addons/:id           - Soft delete
```

## MODULE 4: ORDERS (Core Module)

### Enums

```
enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
  DELIVERY = 'delivery'
}

enum OrderStatus {
  OPEN = 'open',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}
```

### Order Entity

| Field                 | Type          | Notes                                         |
| --------------------- | ------------- | --------------------------------------------- |
| id                    | UUID          | PK                                            |
| order_number          | string        | Auto-generated, unique per day (e.g., "#001") |
| type                  | OrderType     | Required                                      |
| status                | OrderStatus   | Default: OPEN                                 |
| table_number          | string        | Nullable (required for dine_in)               |
| customer_name         | string        | Nullable                                      |
| customer_phone        | string        | Nullable                                      |
| delivery_address      | string        | Nullable (for delivery type)                  |
| notes                 | text          | Nullable                                      |
| subtotal              | decimal(10,2) | Calculated: sum of items                      |
| discount_type         | enum          | 'percentage' or 'fixed', nullable             |
| discount_value        | decimal(10,2) | The discount percentage or fixed amount       |
| discount_amount       | decimal(10,2) | Calculated actual discount in currency        |
| tax_rate              | decimal(5,2)  | From settings at time of order                |
| tax_amount            | decimal(10,2) | Calculated                                    |
| service_charge_rate   | decimal(5,2)  | From settings                                 |
| service_charge_amount | decimal(10,2) | Calculated                                    |
| total                 | decimal(10,2) | subtotal - discount + tax + service_charge    |
| cashier_id            | UUID          | FK → users                                    |
| shift_id              | UUID          | FK → shifts                                   |
| created_at            | timestamp     | Auto                                          |
| updated_at            | timestamp     | Auto                                          |
| confirmed_at          | timestamp     | Nullable                                      |
| completed_at          | timestamp     | Nullable                                      |
| cancelled_at          | timestamp     | Nullable                                      |
| cancel_reason         | string        | Required when status = CANCELLED              |

### OrderItem Entity

| Field        | Type          | Notes                                      |
| ------------ | ------------- | ------------------------------------------ |
| id           | UUID          | PK                                         |
| order_id     | UUID          | FK → orders                                |
| menu_item_id | UUID          | FK → menu_items                            |
| variant_id   | UUID          | FK → variants, nullable                    |
| item_name_ar | string        | Snapshot at order time                     |
| item_name_en | string        | Snapshot at order time                     |
| unit_price   | decimal(10,2) | base_price + variant adjustment (snapshot) |
| quantity     | integer       | Min: 1                                     |
| subtotal     | decimal(10,2) | unit_price \* quantity + addons total      |
| notes        | string        | e.g., "no sugar"                           |
| is_voided    | boolean       | Default: false                             |
| void_reason  | string        | Required when voided                       |
| voided_by    | UUID          | FK → users, nullable                       |
| voided_at    | timestamp     | Nullable                                   |
| created_at   | timestamp     | Auto                                       |

### OrderItemAddOn Entity

| Field         | Type          | Notes            |
| ------------- | ------------- | ---------------- |
| id            | UUID          | PK               |
| order_item_id | UUID          | FK → order_items |
| addon_id      | UUID          | FK → addons      |
| addon_name    | string        | Snapshot         |
| price         | decimal(10,2) | Snapshot         |

### OrderStatusLog Entity

| Field       | Type        | Notes                       |
| ----------- | ----------- | --------------------------- |
| id          | UUID        | PK                          |
| order_id    | UUID        | FK → orders                 |
| from_status | OrderStatus | Nullable (null for initial) |
| to_status   | OrderStatus | Required                    |
| changed_by  | UUID        | FK → users                  |
| notes       | string      | Nullable                    |
| changed_at  | timestamp   | Auto                        |

### Order Endpoints

```
POST   /api/v1/orders                        - Create new order
GET    /api/v1/orders                         - List orders (filter: status, type, date, cashier_id; paginated)
GET    /api/v1/orders/active                  - Get all non-final orders (OPEN, CONFIRMED, PREPARING, READY)
GET    /api/v1/orders/:id                     - Get order with items, addons, status history
PATCH  /api/v1/orders/:id                     - Update order details (notes, discount, customer info)
PATCH  /api/v1/orders/:id/status              - Change status (body: { status, notes? })
DELETE /api/v1/orders/:id                     - Cancel order (body: { reason })

POST   /api/v1/orders/:id/items               - Add items to order (body: array of items with addons)
PATCH  /api/v1/orders/:id/items/:itemId       - Update item (quantity, notes)
DELETE /api/v1/orders/:id/items/:itemId       - Void/remove item (body: { reason })

GET    /api/v1/orders/:id/history             - Get full status change log
POST   /api/v1/orders/:id/duplicate           - Create new OPEN order copying items from this one
```

### Order Business Logic (CRITICAL)

1. **Status transitions — enforce these STRICTLY:**
   - OPEN → CONFIRMED, CANCELLED
   - CONFIRMED → PREPARING, CANCELLED
   - PREPARING → READY
   - READY → COMPLETED
   - COMPLETED → REFUNDED (Manager only)
   - CANCELLED → (terminal, no transitions)
   - REFUNDED → (terminal, no transitions)
   - Any invalid transition → throw 409 Conflict with ORDER_INVALID_STATUS

2. **Order number generation:**
   - On create: query today's max order_number, increment by 1
   - Format: "#001", "#002", etc.
   - "Today" is defined by business day settings (start: 06:00, end: 02:00+1)
   - Use a DB sequence or advisory lock to prevent duplicates under concurrency

3. **Price calculation (recalculate on every item add/update/remove):**

   ```
   item.subtotal = (base_price + variant.price_adjustment) * quantity + SUM(addon.price) * quantity
   order.subtotal = SUM(non-voided items.subtotal)
   order.discount_amount = if percentage: subtotal * discount_value / 100, if fixed: discount_value
   order.tax_amount = (subtotal - discount_amount) * tax_rate / 100
   order.service_charge_amount = (subtotal - discount_amount) * service_charge_rate / 100
   order.total = subtotal - discount_amount + tax_amount + service_charge_amount
   ```

4. **Item modifications:**
   - Can add/update/remove items ONLY when order is OPEN
   - Voiding items in CONFIRMED+ requires Manager role and a reason
   - Snapshot item_name and price at creation time (menu changes don't affect existing orders)

5. **Cancellation:**
   - Requires a cancel_reason
   - If order is CONFIRMED+, only Manager/Admin can cancel
   - Record cancellation in OrderStatusLog

6. **Active orders query:**
   - Return orders with status IN (OPEN, CONFIRMED, PREPARING, READY)
   - Sorted by created_at ASC (oldest first)
   - Include item count and total for quick POS display

## MODULE 5: INVOICING & PAYMENTS

### Invoice Entity

| Field                 | Type          | Notes                                |
| --------------------- | ------------- | ------------------------------------ |
| id                    | UUID          | PK                                   |
| invoice_number        | string        | Sequential: "INV-2026-00001"         |
| order_id              | UUID          | FK → orders, unique                  |
| subtotal              | decimal(10,2) | From order                           |
| discount_amount       | decimal(10,2) | From order                           |
| discount_type         | string        | Nullable                             |
| tax_rate              | decimal(5,2)  |                                      |
| tax_amount            | decimal(10,2) |                                      |
| service_charge_rate   | decimal(5,2)  |                                      |
| service_charge_amount | decimal(10,2) |                                      |
| total                 | decimal(10,2) |                                      |
| status                | enum          | 'paid', 'refunded', 'partial_refund' |
| issued_at             | timestamp     | Auto                                 |
| issued_by             | UUID          | FK → users                           |

### Payment Entity

| Field            | Type          | Notes                              |
| ---------------- | ------------- | ---------------------------------- |
| id               | UUID          | PK                                 |
| invoice_id       | UUID          | FK → invoices                      |
| method           | enum          | 'cash', 'card', 'wallet', 'online' |
| amount           | decimal(10,2) | Required                           |
| reference_number | string        | For card/online payments           |
| card_last_four   | string        | Nullable                           |
| received_at      | timestamp     | Auto                               |
| processed_by     | UUID          | FK → users                         |

### Refund Entity

| Field       | Type          | Notes                         |
| ----------- | ------------- | ----------------------------- |
| id          | UUID          | PK                            |
| invoice_id  | UUID          | FK → invoices                 |
| payment_id  | UUID          | FK → payments, nullable       |
| amount      | decimal(10,2) | Required                      |
| reason      | string        | Required                      |
| approved_by | UUID          | FK → users (must be Manager+) |
| refunded_at | timestamp     | Auto                          |

### CashDrawer Entity

| Field            | Type          | Notes                              |
| ---------------- | ------------- | ---------------------------------- |
| id               | UUID          | PK                                 |
| shift_id         | UUID          | FK → shifts, unique                |
| opening_balance  | decimal(10,2) | From shift opening_cash            |
| total_cash_in    | decimal(10,2) | Sum of cash payments in this shift |
| total_cash_out   | decimal(10,2) | Manual cash-outs + cash refunds    |
| expected_balance | decimal(10,2) | opening + cash_in - cash_out       |
| actual_balance   | decimal(10,2) | From shift closing_cash            |
| difference       | decimal(10,2) | actual - expected                  |
| notes            | string        | Nullable                           |
| opened_at        | timestamp     |                                    |
| closed_at        | timestamp     | Nullable                           |

### Payment Endpoints

```
POST   /api/v1/orders/:id/pay                - Process payment (body: { payments: [{ method, amount, reference_number?, card_last_four? }] })
GET    /api/v1/invoices                       - List invoices (filter: date range, status, payment method)
GET    /api/v1/invoices/:id                   - Get invoice with payments and order details
GET    /api/v1/invoices/:id/receipt           - Get receipt data (structured JSON for thermal or PDF rendering)
POST   /api/v1/invoices/:id/refund            - Process refund (body: { amount, reason, payment_id? }) — Manager only
GET    /api/v1/cash-drawer                    - Get current shift's cash drawer
POST   /api/v1/cash-drawer/cash-in            - Record cash added (body: { amount, notes })
POST   /api/v1/cash-drawer/cash-out           - Record cash removed (body: { amount, notes })
```

### Payment Business Logic

1. **Processing payment (POST /orders/:id/pay):**
   - Order must be in READY or CONFIRMED status (configurable)
   - Sum of payments[].amount must >= order.total
   - If cash payment: calculate change = payment_amount - order.total
   - Create Invoice with sequential number
   - Create Payment records for each payment method
   - Update order status to COMPLETED
   - Update CashDrawer totals if cash payment
   - All in a single DB transaction
   - Return invoice with change amount

2. **Invoice numbering:**
   - Format: INV-{YYYY}-{5-digit-seq} → "INV-2026-00001"
   - Use DB sequence for thread-safe incrementing

3. **Refund processing:**
   - Manager/Admin only
   - Cannot refund more than original payment total
   - If full refund: update invoice status to 'refunded', update order status to REFUNDED
   - If partial: update invoice status to 'partial_refund'
   - If cash refund: update CashDrawer.total_cash_out

4. **Receipt data structure (GET /invoices/:id/receipt):**
   ```json
   {
     "restaurant": { "name", "address", "phone", "vat_number", "logo_url" },
     "invoice_number": "INV-2026-00001",
     "date": "2026-05-17T14:30:00",
     "order_number": "#042",
     "order_type": "dine_in",
     "table_number": "A5",
     "cashier": "Ahmed",
     "items": [
       {
         "name_ar": "...", "name_en": "...",
         "variant": "Large",
         "quantity": 2,
         "unit_price": 25.00,
         "addons": [{ "name": "Extra shot", "price": 3.00 }],
         "total": 56.00
       }
     ],
     "subtotal": 56.00,
     "discount": { "type": "percentage", "value": 10, "amount": 5.60 },
     "tax": { "rate": 15, "amount": 7.56 },
     "service_charge": { "rate": 0, "amount": 0 },
     "total": 57.96,
     "payments": [{ "method": "cash", "amount": 60.00 }],
     "change": 2.04,
     "footer": "Thank you for visiting!"
   }
   ```

## MODULE 6: REPORTS

### Daily Report Endpoint

```
GET /api/v1/reports/daily?date=2026-05-17     - Specific date
GET /api/v1/reports/daily/today               - Live today
```

### Daily Report Response Structure

```json
{
  "date": "2026-05-17",
  "business_day": { "start": "2026-05-17T06:00:00", "end": "2026-05-18T02:00:00" },
  "sales_summary": {
    "total_revenue": 15420.50,
    "total_orders": 127,
    "average_order_value": 121.42,
    "total_items_sold": 342
  },
  "payment_breakdown": {
    "cash": { "count": 45, "total": 5200.00 },
    "card": { "count": 72, "total": 9100.50 },
    "wallet": { "count": 8, "total": 820.00 },
    "online": { "count": 2, "total": 300.00 }
  },
  "order_type_breakdown": {
    "dine_in": { "count": 80, "revenue": 10200.00 },
    "takeaway": { "count": 35, "revenue": 3800.50 },
    "delivery": { "count": 12, "revenue": 1420.00 }
  },
  "discounts_and_refunds": {
    "total_discounts": 650.00,
    "total_refunds": 120.00,
    "net_revenue": 14650.50
  },
  "tax_summary": {
    "total_vat": 2013.07,
    "total_service_charge": 0
  },
  "top_items_by_quantity": [
    { "menu_item_id": "...", "name_en": "Cappuccino", "name_ar": "كابتشينو", "quantity": 45, "revenue": 675.00 }
  ],
  "top_items_by_revenue": [ ... ],
  "category_performance": [
    { "category_id": "...", "name_en": "Hot Drinks", "name_ar": "مشروبات ساخنة", "quantity": 120, "revenue": 3600.00 }
  ],
  "hourly_breakdown": [
    { "hour": 8, "orders": 12, "revenue": 1440.00 },
    { "hour": 9, "orders": 18, "revenue": 2160.00 }
  ],
  "cashier_performance": [
    { "user_id": "...", "name": "Ahmed", "orders": 45, "revenue": 5400.00 }
  ],
  "cash_drawer": {
    "opening_balance": 500.00,
    "cash_in": 5200.00,
    "cash_out": 120.00,
    "expected_balance": 5580.00,
    "actual_balance": 5575.00,
    "difference": -5.00
  },
  "cancellations": {
    "cancelled_orders": 3,
    "cancelled_value": 180.00,
    "voided_items": 5,
    "voided_value": 75.00,
    "top_reasons": ["Customer changed mind", "Item unavailable"]
  }
}
```

### Weekly Report Endpoint

```
GET /api/v1/reports/weekly?week=2026-W20      - Specific ISO week
GET /api/v1/reports/weekly/current             - Current week live
```

### Weekly Report Response Structure

```json
{
  "week": "2026-W20",
  "date_range": { "start": "2026-05-11", "end": "2026-05-17" },
  "overview": {
    "total_revenue": 98500.00,
    "total_orders": 856,
    "avg_daily_revenue": 14071.43,
    "avg_order_value": 115.07
  },
  "daily_comparison": [
    { "date": "2026-05-11", "day": "Monday", "orders": 110, "revenue": 12500.00 },
    { "date": "2026-05-12", "day": "Tuesday", "orders": 105, "revenue": 11800.00 }
  ],
  "vs_previous_week": {
    "revenue_change_pct": 5.2,
    "orders_change_pct": 3.1,
    "avg_order_value_change_pct": 2.0
  },
  "best_day": { "date": "2026-05-16", "day": "Friday", "revenue": 18200.00 },
  "worst_day": { "date": "2026-05-13", "day": "Wednesday", "revenue": 9800.00 },
  "peak_hours": [
    { "hour": 13, "avg_orders": 22.4 },
    { "hour": 20, "avg_orders": 19.8 }
  ],
  "top_items_by_quantity": [ ... ],
  "top_items_by_revenue": [ ... ],
  "category_trends": [
    { "category": "Hot Drinks", "this_week": 8500.00, "last_week": 7900.00, "change_pct": 7.6 }
  ],
  "payment_trends": {
    "cash_pct": 33.7,
    "card_pct": 58.9,
    "wallet_pct": 5.3,
    "online_pct": 2.1
  },
  "cashier_summary": [ ... ],
  "cancellations": {
    "total_cancelled": 18,
    "cancellation_rate_pct": 2.1,
    "top_reasons": [ ... ]
  }
}
```

### Additional Report Endpoints

```
GET /api/v1/reports/sales-by-hour?date=...                    - Hourly sales for a specific date
GET /api/v1/reports/top-items?period=daily&date=...           - Top selling items (daily or weekly)
GET /api/v1/reports/category-sales?period=weekly&week=...     - Sales by category
GET /api/v1/reports/cashier-summary?date=...                  - Per-cashier stats
GET /api/v1/reports/payment-summary?date=...                  - Payment method breakdown
```

### Report Business Logic

- "Business day" is configurable (default: 06:00 to 02:00+1), use settings table
- Only include COMPLETED and REFUNDED orders in revenue calculations
- CANCELLED orders counted separately in cancellations section
- Voided items excluded from sales, tracked separately
- Use raw SQL queries with TypeORM QueryBuilder for complex aggregations (better performance)
- Cache daily reports for past dates (they won't change) in Redis with 24h TTL
- "Today" reports are always live (no cache)

## MODULE 7: SETTINGS

### Setting Entity (Key-Value Store)

| Field      | Type      | Notes                                        |
| ---------- | --------- | -------------------------------------------- |
| id         | UUID      | PK                                           |
| key        | string    | Unique (e.g., "restaurant_name", "vat_rate") |
| value      | text      | JSON string for complex values               |
| updated_at | timestamp | Auto                                         |
| updated_by | UUID      | FK → users                                   |

### Default Settings (seed these on first run)

```json
{
  "restaurant_name": "",
  "restaurant_name_ar": "",
  "address": "",
  "phone": "",
  "vat_rate": "15",
  "vat_registration_number": "",
  "service_charge_rate": "0",
  "currency_code": "SAR",
  "currency_symbol": "ر.س",
  "order_number_format": "daily_reset",
  "invoice_number_prefix": "INV",
  "business_day_start": "06:00",
  "business_day_end": "02:00",
  "receipt_footer": "Thank you!",
  "rounding_rule": "0.01",
  "auto_close_timeout_hours": "0",
  "require_pin": "false",
  "timezone": "Asia/Riyadh"
}
```

### Settings Endpoints

```
GET    /api/v1/settings             - Get all settings (Admin/Manager)
PATCH  /api/v1/settings             - Update settings (body: { key: value, ... }) — Admin only
POST   /api/v1/settings/logo        - Upload restaurant logo (multipart/form-data) — Admin only
```

## MODULE 8: ERROR HANDLING

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order with ID xxx does not exist",
    "field": null
  },
  "statusCode": 404,
  "timestamp": "2026-05-17T14:30:00.000Z"
}
```

### Error Codes to Implement

| Code                      | HTTP | When                                        |
| ------------------------- | ---- | ------------------------------------------- |
| AUTH_INVALID_CREDENTIALS  | 401  | Wrong username/password/PIN                 |
| AUTH_TOKEN_EXPIRED        | 401  | JWT expired                                 |
| AUTH_FORBIDDEN            | 403  | Insufficient role                           |
| ORDER_NOT_FOUND           | 404  | Order doesn't exist                         |
| ORDER_INVALID_STATUS      | 409  | Invalid status transition                   |
| ORDER_ALREADY_PAID        | 409  | Trying to pay again                         |
| ORDER_EMPTY               | 422  | Confirming with no items                    |
| ORDER_MODIFICATION_DENIED | 403  | Editing non-OPEN order without Manager role |
| ITEM_NOT_AVAILABLE        | 422  | Menu item inactive/deleted                  |
| PAYMENT_INSUFFICIENT      | 422  | Payment < order total                       |
| REFUND_EXCEEDS_PAYMENT    | 422  | Refund > paid amount                        |
| SHIFT_NOT_OPEN            | 409  | No active shift for cashier                 |
| SHIFT_ALREADY_OPEN        | 409  | Trying to open 2nd shift                    |
| VALIDATION_ERROR          | 422  | DTO validation failure                      |
| DUPLICATE_ENTRY           | 409  | Unique constraint violation                 |
| INTERNAL_ERROR            | 500  | Unexpected server error                     |

### Global Exception Filter

- Catch all exceptions → format to standard response
- Log errors with request context (user, endpoint, body)
- Never expose stack traces in production

## MODULE 9: STANDARD RESPONSE FORMAT

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

### Use a TransformInterceptor to wrap all responses automatically.

## NON-FUNCTIONAL REQUIREMENTS

1. **Validation:** Use class-validator on ALL DTOs. Every field validated. Use custom validators for business rules (e.g., ValidOrderStatusTransition).
2. **Pagination:** All list endpoints support: ?page=1&limit=20&sort=created_at&order=desc
3. **Filtering:** Use query params. Build a reusable filter utility.
4. **Soft Delete:** All main entities use @DeleteDateColumn(). Queries exclude deleted by default.
5. **Audit Trail:** OrderStatusLog for orders. Consider a generic AuditLog entity for sensitive ops (refunds, voids, setting changes).
6. **Database Indexes:** Add indexes on: orders.status, orders.created_at, orders.cashier_id, orders.shift_id, invoices.issued_at, payments.method.
7. **Transactions:** Use QueryRunner transactions for: payment processing, order creation with items, refund processing.
8. **Seeds:** Create a seed script that adds: default admin user (admin/admin123), default settings, sample categories and menu items.
9. **Migrations:** Use TypeORM migrations (not auto-sync in production).
10. **Health Check:** GET /api/v1/health → { status: 'ok', db: 'connected', redis: 'connected', uptime: ... }
11. **CORS:** Configurable allowed origins via .env
12. **Rate Limiting:** 100 req/min general, 5 req/15min for login

## ENVIRONMENT VARIABLES (.env.example)

```
# App
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pos_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your-access-secret-key
JWT_ACCESS_EXPIRATION=30m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:4200

# Throttle
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## EXECUTION INSTRUCTIONS

1. Initialize the NestJS project: `nest new pos-system`
2. Install all required dependencies
3. Set up the project structure as defined above
4. Implement modules in this order:
   - Common (guards, filters, interceptors, decorators, DTOs)
   - Config (database, jwt, redis, swagger)
   - Users & Auth
   - Shifts
   - Categories, MenuItems, AddOns
   - Orders (with full lifecycle)
   - Invoices & Payments & CashDrawer
   - Reports (daily + weekly)
   - Settings
   - Seeds & Migrations
5. Add Swagger decorators on all controllers and DTOs
6. Write e2e tests for critical flows (auth, create order, pay, reports)
7. Ensure `npm run start:dev` works with no errors

Generate ALL files with complete, working code. Do not skip any module or leave TODOs. Every endpoint, every entity, every DTO, every guard, every service method — fully implemented.
