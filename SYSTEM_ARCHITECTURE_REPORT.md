# COMMA POS System - Technical Architecture Report

**Generated:** June 2, 2026  
**Repository State:** Clean working tree on main branch  
**Latest Commit:** bd81a37 - Add complete table order workflow UI

---

## 1. Executive Summary

**Project:** COMMA - Restaurant & Café Point of Sale System  
**Purpose:** Premium POS system for managing café/restaurant operations including order management, table management, receipts, invoicing, and analytics.

**Main Business Workflows:**
- User authentication with JWT tokens (password + PIN support)
- Table-based order management (dine-in, takeaway, delivery)
- Order lifecycle: OPEN → IN_PROGRESS → PREPARING → READY → COMPLETED → PAID
- Receipt generation from orders
- Invoice processing and payment handling
- Dashboard analytics with daily/weekly/monthly reports
- Shift management with cash drawer operations
- Settings configuration with 13 specialized modules

**Technology Stack:**
- **Frontend:** Next.js 15.1, React 19, TypeScript, Tailwind CSS
- **Backend:** NestJS (Node.js framework), TypeORM ORM
- **Database:** PostgreSQL (TypeORM migrations)
- **Auth:** JWT (access + refresh tokens), Passport.js
- **Language Support:** English/Arabic (i18n)
- **Caching:** Cache Manager (memory-based)
- **API:** RESTful with Swagger documentation

**Architecture Overview:**
```
Client (Next.js App)
    ↓
Front Gateway (api-server.js mock)
    ↓
NestJS Backend (Port 3000)
    ├─ Auth Module (JWT)
    ├─ Order Management (with Table tracking)
    ├─ Receipt & Invoice System
    ├─ Settings Module (13 sub-services)
    ├─ Dashboard & Reports
    └─ PostgreSQL Database
```

---

## 2. Repository Structure

```
comma/
├── app/                           # Next.js App Router (frontend pages)
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── orders/page.tsx        # Orders management
│   │   ├── tables/page.tsx        # Table management UI
│   │   ├── receipts/page.tsx      # Receipt viewer
│   │   ├── shifts/page.tsx        # Shift management
│   │   ├── reports/
│   │   │   ├── page.tsx           # Reports overview
│   │   │   ├── daily/page.tsx
│   │   │   ├── weekly/page.tsx
│   │   │   └── monthly/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── menu/page.tsx
│   │   └── settings/page.tsx
│   ├── admin/
│   │   ├── layout.tsx             # Admin shell layout
│   │   └── settings/
│   │       ├── page.tsx           # Settings main page
│   │       ├── hooks/
│   │       │   ├── useSettings.ts
│   │       │   └── useUnsavedChanges.ts
│   │       ├── components/
│   │       │   ├── SettingsForm.tsx
│   │       │   ├── SettingsSidebar.tsx
│   │       │   ├── FormField.tsx
│   │       │   └── sections/ (13 setting modules)
│   ├── menu/                      # Guest menu ordering page
│   │   ├── page.tsx
│   │   └── [tableId]/page.tsx    # Table-specific menu
│   ├── login/page.tsx
│   ├── layout.tsx                 # Root layout with providers
│   └── api/v1/settings/[...slug]/ # Settings API proxy route
│
├── components/                    # React components
│   ├── AuthProvider.tsx           # Auth context provider
│   ├── LangProvider.tsx           # Language context (EN/AR)
│   ├── ErrorBoundary.tsx
│   ├── admin/                     # Admin-specific components
│   │   ├── AdminShell.tsx
│   │   ├── AuthGate.tsx
│   │   ├── Sidebar.tsx
│   │   ├── DashboardProvider.tsx
│   │   ├── OrdersProvider.tsx
│   │   ├── OrdersManager.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── OrdersManager.tsx
│   │   ├── TablesManager.tsx
│   │   ├── TableOrderPanel.tsx
│   │   ├── MenuManager.tsx
│   │   ├── AddOrderModal.tsx
│   │   ├── AdminItemModal.tsx
│   │   ├── StatCards.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── CategoryBars.tsx
│   │   ├── MostOrdered.tsx
│   │   ├── StatusSummary.tsx
│   │   ├── DailyReportPage.tsx
│   │   ├── WeeklyReportPage.tsx
│   │   ├── MonthlyReportPage.tsx
│   │   └── ReportsOverview.tsx
│   ├── menu/                     # Guest menu components
│   │   ├── MenuClient.tsx
│   │   ├── MenuNavbar.tsx
│   │   ├── MenuCard.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartBar.tsx
│   │   ├── CustomerItemModal.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   └── Footer.tsx
│   └── dashboard/shifts/         # Shift-specific components
│       ├── ShiftHeader.tsx
│       ├── ShiftTabs.tsx
│       ├── ShiftCard.tsx
│       ├── ShiftTable.tsx
│       ├── ShiftStats.tsx
│       ├── OpenShiftDialog.tsx
│       ├── CloseShiftDialog.tsx
│       └── ... (10+ files)
│
├── hooks/                         # Custom React hooks
│   └── [shared utilities]
│
├── lib/                           # Utilities
│   ├── api.ts                    # API client with all endpoints
│   ├── auth.ts
│   ├── i18n.ts                   # Language utilities
│   └── [other utilities]
│
├── public/                        # Static assets
│
├── POS/                           # NestJS Backend
│   ├── src/
│   │   ├── main.ts              # Entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── common/
│   │   │   ├── decorators/      # JWT, Roles, CurrentUser
│   │   │   ├── dto/             # API response, pagination
│   │   │   ├── enums/           # User roles, order types, statuses, payments
│   │   │   ├── filters/         # HTTP exception filter
│   │   │   ├── guards/          # JWT auth, roles-based access
│   │   │   └── interceptors/    # Transform, logging
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── redis.config.ts
│   │   ├── database/
│   │   │   ├── data-source.ts   # TypeORM config
│   │   │   ├── migrations/      # 25+ migrations
│   │   │   ├── seeds/
│   │   │   └── seeding.service.ts
│   │   └── modules/             # Feature modules
│   │       ├── auth/            # JWT authentication
│   │       ├── users/           # User management
│   │       ├── shifts/          # Shift management
│   │       ├── categories/      # Menu categories
│   │       ├── menu-items/      # Menu items + variants
│   │       ├── addons/          # Add-ons for items
│   │       ├── tables/          # Table management
│   │       ├── orders/          # Order processing
│   │       ├── invoices/        # Invoice generation
│   │       ├── receipts/        # Receipt generation
│   │       ├── cash-drawer/     # Cash management
│   │       ├── reports/         # Analytics & reports
│   │       ├── dashboard/       # Dashboard stats
│   │       ├── settings/        # Configuration (13 sub-services)
│   │       └── public/          # Public endpoints (no auth)
│   ├── jest.config.js           # Test configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── setup-db.sql             # Database setup script
│
├── api-server.js                 # Mock/demo API server (Express)
├── package.json                  # Root project config
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.example                  # Environment variables template
```

---

## 3. Backend Architecture

### 3.1 Module Overview

| Module | Purpose | Key Entities | Endpoints |
|--------|---------|--------------|-----------|
| **Auth** | JWT token generation & validation | User | `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` |
| **Users** | User management | User | `/users`, `/users/:id` |
| **Shifts** | Work shift tracking | Shift | `/shifts`, `/shifts/current`, `/shifts/open`, `/shifts/close` |
| **Categories** | Menu organization | Category | `/categories`, `/categories/:id` |
| **Menu Items** | Product catalog | MenuItem, Variant | `/menu-items`, `/menu-items/:id` |
| **Addons** | Item customization | Addon | `/addons`, `/addons/:id` |
| **Tables** | Physical table tracking | Table | `/tables`, `/tables/:id` |
| **Orders** | Order lifecycle | Order, OrderItem, OrderStatusLog | `/orders`, `/orders/:id`, `/orders/table/:tableId/open-or-create` |
| **Invoices** | Payment tracking | Invoice | `/invoices`, `/invoices/:id`, `/invoices/:id/export` |
| **Receipts** | Receipt generation | Receipt, ReceiptItem | `/receipts`, `/receipts/:id` |
| **Cash Drawer** | Cash management | CashDrawer | `/cash-drawer`, `/cash-drawer/start`, `/cash-drawer/end` |
| **Reports** | Analytics | DailyReport, WeeklyReport, MonthlyReport, ReportLog | `/reports/daily`, `/reports/weekly`, `/reports/monthly` |
| **Dashboard** | Business metrics | None | `/dashboard/stats`, `/dashboard/summary` |
| **Settings** | Configuration (13 sub-services) | 13 entity types | `/settings/*` |
| **Public** | Guest endpoints | None | `/public/categories`, `/public/menu-items`, `/public/orders` |

### 3.2 Controllers (13 total)

**Core Controllers:**
- `auth.controller.ts` - Login, refresh, logout, current user
- `users.controller.ts` - User CRUD + password/PIN management
- `orders.controller.ts` - Order creation, status changes, payment checkout, receipt generation
- `tables.controller.ts` - Table management with status tracking
- `receipts.controller.ts` - Receipt CRUD and printing
- `shifts.controller.ts` - Shift open/close operations
- `dashboard.controller.ts` - Business statistics endpoint
- `invoices.controller.ts` - Invoice management
- `reports.controller.ts` - Report generation with filters
- `categories.controller.ts` - Menu category management
- `menu-items.controller.ts` - Menu item CRUD
- `addons.controller.ts` - Add-on management
- `public.controller.ts` - Public API (guest ordering)

**Key Endpoints:**
```
POST   /api/v1/auth/login           → AuthService.login()
POST   /api/v1/orders              → OrdersService.create()
GET    /api/v1/orders/active       → OrdersService.getActiveOrders()
POST   /api/v1/orders/table/:tableId/open-or-create
GET    /api/v1/orders/table/:tableId/active
POST   /api/v1/orders/:id/checkout → checkoutTable() + payment + receipt generation
PATCH  /api/v1/orders/:id/status   → OrdersService.changeStatus()
POST   /api/v1/orders/:id/items/:itemId/void
POST   /api/v1/receipts/:orderId/generate
GET    /api/v1/invoices/:id
PATCH  /api/v1/tables/:id/assign-order
GET    /api/v1/dashboard/stats
GET    /api/v1/reports/daily
GET    /api/v1/settings/*          (13 endpoints for each settings module)
```

### 3.3 Services Architecture

**OrdersService** - Most complex service:
- `create(user, dto)` - Create order with items, assign to table
- `addItems(orderId, items, userId)` - Add items to open order
- `removeItem(orderId, itemId)` - Delete order item
- `voidItem(orderId, itemId, dto, userId)` - Mark item as voided
- `changeStatus(orderId, dto, userId)` - Status transitions with logging
- `checkoutTable(orderId, userId, dto)` - Apply discounts, calculate totals
- `getOrCreateTableOrder(tableId, user)` - Create or return existing table order
- `getActiveTableOrder(tableId)` - Fetch current order for table
- `findById(id), findAll(pagination, filters)` - Retrieval
- `cancel(orderId, reason, userId)` - Cancel entire order

**ReceiptService:**
- `generateReceipt(order, cashierName, waiterName, paymentMethod, businessInfo)` - Creates receipt from paid order
- `findById(id), findByReceiptNumber(number)` - Lookup
- `findAll(filters)` - List with pagination

**Auth & Users:**
- JWT token generation (access + refresh)
- Password + PIN validation
- User role-based access control
- Token blacklisting on logout

**Reports:**
- `ReportGeneratorService` - Daily/weekly/monthly aggregation
- `ReportSchedulerService` - Automated report generation
- `ReportPdfService` - PDF export

**Settings Services (13 modules):**
- BusinessSettingsService
- RestaurantSettingsService
- MenuSettingsService
- TableSettingsService
- OrderStatusSettingsService
- PaymentSettingsService
- UserManagementSettingsService
- ShiftSettingsService
- NotificationSettingsService
- ReportSettingsService
- AppearanceSettingsService
- SecuritySettingsService
- MonitoringSettingsService

### 3.4 Guards & Interceptors

**Guards:**
- `JwtAuthGuard` - Validates JWT tokens, extracts user from payload
- `RolesGuard` - Checks user role against @Roles() decorator

**Interceptors:**
- `TransformInterceptor` - Wraps responses as `{ success, data }`
- `LoggingInterceptor` - Logs HTTP requests/responses

**Filters:**
- `HttpExceptionFilter` - Standardizes error responses

### 3.5 DTOs (Data Transfer Objects)

```typescript
// Auth
LoginDto: { username, password OR pin }
TokensDto: { accessToken, refreshToken, expiresIn }

// Orders
CreateOrderDto: {
  type (enum), table_id, table_number, customer_name,
  customer_phone, delivery_address, notes,
  discount_type, discount_value, items []
}
UpdateOrderDto: { customer_name, notes, etc. }
ChangeOrderStatusDto: { new_status, notes? }
AddOrderItemsDto: { items: [{ menu_item_id, variant_id?, quantity, addon_ids?, notes? }] }
VoidOrderItemDto: { reason }
CancelOrderDto: { reason }

// Users
CreateUserDto: { username, password, full_name, role, is_active }
UpdateUserDto: (partial)

// Tables
CreateTableDto: { table_number, capacity, location, notes }

// Invoices
ProcessPaymentDto: { payments: [{ method, amount }] }

// Reports
GenerateReportDto: { type, start_date, end_date }
ReportQueryDto: { page, limit, filters }
```

---

## 4. Frontend Architecture

### 4.1 Pages (App Router)

| Page | Route | Purpose | Protected |
|------|-------|---------|-----------|
| Login | `/login` | User authentication | No |
| Guest Menu | `/menu` | QR code ordering | No |
| Table Menu | `/menu/[tableId]` | Order from table | No |
| Dashboard | `/dashboard` | Main analytics | Yes (Manager/Admin) |
| Orders | `/dashboard/orders` | Order management | Yes |
| Tables | `/dashboard/tables` | Table status | Yes |
| Shifts | `/dashboard/shifts` | Shift tracking | Yes |
| Receipts | `/dashboard/receipts` | Receipt viewer | Yes |
| Reports | `/dashboard/reports` | Report overview | Yes |
| Daily Reports | `/dashboard/reports/daily` | Daily analytics | Yes |
| Weekly Reports | `/dashboard/reports/weekly` | Weekly analytics | Yes |
| Monthly Reports | `/dashboard/reports/monthly` | Monthly analytics | Yes |
| Analytics | `/dashboard/analytics` | KPI dashboard | Yes |
| Menu Admin | `/dashboard/menu` | Menu editor | Yes (Admin) |
| Admin Settings | `/admin/settings` | Configuration hub (13 sections) | Yes (Admin) |

### 4.2 Component Structure

**Layout Components:**
- `DashboardLayout` - Admin dashboard wrapper
- `AdminShell` - Admin interface container
- `Sidebar` - Navigation sidebar
- `Header` - Top navigation

**Provider Components:**
- `AuthProvider` - Authentication context (JWT management)
- `LangProvider` - Language context (EN/AR)
- `DashboardProvider` - Dashboard data context
- `OrdersProvider` - Orders state management

**Feature Components:**
- `OrdersTable` - Paginated orders display
- `TablesManager` - Table grid with status
- `TableOrderPanel` - Table order detail panel
- `MenuManager` - Menu item editor
- `AddOrderModal` - Create order dialog
- `AdminItemModal` - Edit menu item dialog
- `CustomerItemModal` - Guest order item selection

**Chart Components:**
- `RevenueChart` - Revenue line chart
- `CategoryBars` - Category performance bars
- `MostOrdered` - Top items list
- `StatusSummary` - Order status breakdown
- `StatCards` - KPI cards

**Menu Components (Guest):**
- `MenuClient` - Menu page wrapper
- `MenuCard` - Item card with image
- `CartDrawer` - Shopping cart sidebar
- `CartBar` - Cart summary bar
- `MenuNavbar` - Top nav with language toggle

**Shift Components:**
- `ShiftCard` - Shift details card
- `ShiftTable` - Shift orders table
- `ShiftStats` - Shift KPIs
- `OpenShiftDialog` - Open shift modal
- `CloseShiftDialog` - Close shift modal
- `ShiftOrders` - Orders in shift

**Settings Components (Admin):**
- `SettingsForm` - Main form wrapper
- `SettingsSidebar` - Category navigation
- `FormField` - Input wrapper
- `UnsavedChangesDialog` - Unsaved changes warning
- 13 Section components (BusinessInfo, Restaurant, Menu, Table, OrderStatus, Payment, UserManagement, Shift, Notification, Report, Appearance, Security, Monitoring)

### 4.3 Hooks

**Custom Hooks:**
- `useAuth()` - Auth context hook (user, login, logout, refreshToken)
- `useOrders()` - Orders state hook
- `useDashboard()` - Dashboard data hook
- `useSettings()` - Settings form state
- `useUnsavedChanges()` - Form dirty state tracking
- `useShifts()` - Shift management hook
- `useLang()` - Language context hook

### 4.4 State Management

**Context-based (no Redux/Zustand):**
- `AuthContext` - User session, tokens
- `LangContext` - Current language (EN/AR)
- `DashboardContext` - Dashboard stats, filters
- `OrdersContext` - Orders list, active order

**Local Component State:**
- Form state in modals
- Pagination state
- Filter state

---

## 5. Database Documentation

### 5.1 Core Tables

#### users
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| username | VARCHAR | No | Unique |
| password_hash | VARCHAR | Yes | Bcrypt hash |
| password_pin | VARCHAR | Yes | PIN code |
| full_name | VARCHAR | No | |
| role | ENUM(admin\|manager\|cashier) | No | |
| is_active | BOOLEAN | No | Default: true |
| last_login | TIMESTAMP | Yes | |
| created_at | TIMESTAMP | No | |
| updated_at | TIMESTAMP | No | |

**Relationships:**
- One-to-Many: User → Order (cashier_id)
- One-to-Many: User → Receipt (cashier_id)
- One-to-Many: User → Shift

#### shifts
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| user_id | UUID FK | No | Shift operator |
| opening_cash | DECIMAL(10,2) | No | |
| closing_cash | DECIMAL(10,2) | Yes | |
| status | ENUM(open\|closed) | No | |
| opened_at | TIMESTAMP | No | |
| closed_at | TIMESTAMP | Yes | |
| created_at | TIMESTAMP | No | |
| updated_at | TIMESTAMP | No | |

#### tables
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| table_number | INT | No | Unique, 1-N |
| capacity | INT | No | Default: 4 |
| status | ENUM(available\|occupied\|reserved) | No | |
| location | VARCHAR | Yes | "Window", "Corner", etc. |
| notes | TEXT | Yes | |
| active_order_id | UUID | Yes | Current order |
| created_at | TIMESTAMP | No | |
| updated_at | TIMESTAMP | No | |
| deleted_at | TIMESTAMP | Yes | Soft delete |

**Relationships:**
- One-to-Many: Table → Order (table_id)

#### orders
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| order_number | VARCHAR | No | e.g., "ORD-20260602-001" |
| type | ENUM(dine_in\|takeaway\|delivery) | No | |
| source | VARCHAR | No | "pos" or "self_order" |
| status | ENUM | No | See OrderStatus enum |
| table_number | INT | Yes | For dine-in |
| table_id | UUID FK | Yes | Reference to tables |
| customer_name | VARCHAR | Yes | For takeaway/delivery |
| customer_phone | VARCHAR | Yes | |
| delivery_address | VARCHAR | Yes | For delivery orders |
| notes | TEXT | Yes | Special instructions |
| subtotal | DECIMAL(10,2) | No | Before discounts/tax |
| discount_type | VARCHAR | Yes | "percentage", "fixed" |
| discount_value | DECIMAL(10,2) | Yes | e.g., 10 or 10% |
| discount_amount | DECIMAL(10,2) | No | Calculated |
| tax_rate | DECIMAL(5,2) | No | e.g., 15.00 |
| tax_amount | DECIMAL(10,2) | No | Calculated |
| service_charge_rate | DECIMAL(5,2) | No | e.g., 5.00 |
| service_charge_amount | DECIMAL(10,2) | No | |
| total | DECIMAL(10,2) | No | Final amount |
| cashier_id | UUID FK | Yes | User who created |
| shift_id | UUID FK | Yes | Associated shift |
| confirmed_at | TIMESTAMP | Yes | When confirmed |
| completed_at | TIMESTAMP | Yes | When completed |
| cancelled_at | TIMESTAMP | Yes | When cancelled |
| cancel_reason | VARCHAR | Yes | |
| created_at | TIMESTAMP | No | |
| updated_at | TIMESTAMP | No | |

**Relationships:**
- Many-to-One: Order → User (cashier)
- Many-to-One: Order → Shift
- Many-to-One: Order → Table
- One-to-Many: Order → OrderItem (cascade)
- One-to-Many: Order → OrderStatusLog (cascade)
- One-to-One: Order → Receipt

#### order_items
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| order_id | UUID FK | No | |
| menu_item_id | UUID | No | Reference to menu item |
| variant_id | UUID | Yes | e.g., "large" variant |
| item_name_ar | VARCHAR | No | Arabic name |
| item_name_en | VARCHAR | No | English name |
| unit_price | DECIMAL(10,2) | No | Price per unit |
| quantity | INT | No | Default: 1 |
| subtotal | DECIMAL(10,2) | No | unit_price × quantity |
| notes | TEXT | Yes | Special requests |
| is_voided | BOOLEAN | No | Default: false |
| void_reason | VARCHAR | Yes | Why voided |
| voided_by | VARCHAR | Yes | User who voided |
| voided_at | TIMESTAMP | Yes | |
| created_at | TIMESTAMP | No | |

**Relationships:**
- Many-to-One: OrderItem → Order
- One-to-Many: OrderItem → OrderItemAddOn (cascade)

#### order_item_addons
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| order_item_id | UUID FK | No | |
| addon_id | UUID | No | |
| addon_name | VARCHAR | No | e.g., "Extra shot" |
| price | DECIMAL(10,2) | No | |

#### order_status_logs
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| order_id | UUID FK | No | |
| from_status | VARCHAR | Yes | Previous status |
| to_status | VARCHAR | No | New status |
| changed_by | VARCHAR | Yes | User ID |
| notes | VARCHAR | Yes | Reason for change |
| changed_at | TIMESTAMP | No | When changed |

**Audit trail for order status changes.**

#### receipts
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| receipt_number | VARCHAR | No | Unique, e.g., "RCP-20260602-001" |
| order_id | UUID FK | No | |
| table_number | INT | Yes | |
| table_id | UUID | Yes | |
| order_number | VARCHAR | No | |
| cashier_id | UUID FK | Yes | |
| cashier_name | VARCHAR | Yes | Name for printing |
| waiter_id | UUID | Yes | |
| waiter_name | VARCHAR | Yes | |
| subtotal | DECIMAL(10,2) | No | |
| discount_type | VARCHAR | Yes | |
| discount_amount | DECIMAL(10,2) | No | |
| tax_rate | DECIMAL(5,2) | No | |
| tax_amount | DECIMAL(10,2) | No | |
| service_charge_rate | DECIMAL(5,2) | No | |
| service_charge_amount | DECIMAL(10,2) | No | |
| total | DECIMAL(10,2) | No | |
| payment_method | VARCHAR | Yes | "cash", "card", etc. |
| payment_status | VARCHAR | No | Default: "paid" |
| business_name | VARCHAR | Yes | For printing |
| business_address | VARCHAR | Yes | |
| business_phone | VARCHAR | Yes | |
| tax_id | VARCHAR | Yes | VAT/Tax ID |
| footer_message | TEXT | Yes | Receipt footer |
| created_at | TIMESTAMP | No | |

**Relationships:**
- Many-to-One: Receipt → Order
- One-to-Many: Receipt → ReceiptItem (cascade)

#### receipt_items
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| receipt_id | UUID FK | No | |
| item_name_en | VARCHAR | No | |
| item_name_ar | VARCHAR | No | |
| quantity | INT | No | |
| unit_price | DECIMAL(10,2) | No | |
| addons_total | DECIMAL(10,2) | No | Sum of addon prices |
| line_total | DECIMAL(10,2) | No | quantity × unit_price + addons |
| notes | VARCHAR | Yes | |
| created_at | TIMESTAMP | No | |

#### categories
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| name_en | VARCHAR | No | |
| name_ar | VARCHAR | No | |
| slug | VARCHAR | No | Unique |
| description | TEXT | Yes | |
| icon | VARCHAR | Yes | Font icon class |
| order | INT | No | Display order |
| is_active | BOOLEAN | No | Default: true |
| created_at | TIMESTAMP | No | |
| updated_at | TIMESTAMP | No | |

#### menu_items
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| category_id | UUID FK | No | |
| name_en | VARCHAR | No | |
| name_ar | VARCHAR | No | |
| description_en | TEXT | Yes | |
| description_ar | TEXT | Yes | |
| base_price | DECIMAL(10,2) | No | |
| cost | DECIMAL(10,2) | Yes | For COGS |
| image_url | VARCHAR | Yes | |
| is_active | BOOLEAN | No | Availability |
| is_discountable | BOOLEAN | No | Can apply discount |
| prep_time_minutes | INT | Yes | Kitchen time estimate |
| calories | INT | Yes | Nutritional info |
| allergens | VARCHAR | Yes | Comma-separated |
| created_at | TIMESTAMP | No | |
| updated_at | TIMESTAMP | No | |

**Relationships:**
- Many-to-One: MenuItem → Category
- One-to-Many: MenuItem → MenuItemVariant
- One-to-Many: MenuItem → MenuItemAddon

#### menu_item_variants
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | e.g., "size_large" |
| menu_item_id | UUID FK | No | |
| name_en | VARCHAR | No | e.g., "Large" |
| name_ar | VARCHAR | No | |
| price_adjustment | DECIMAL(10,2) | No | Added to base price |

#### menu_item_addons & addons
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| name_en | VARCHAR | No | e.g., "Extra shot" |
| name_ar | VARCHAR | No | |
| price | DECIMAL(10,2) | No | Addon cost |
| is_active | BOOLEAN | No | |

#### invoices
Tracks payments for orders. Auto-created during checkout.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| order_id | UUID FK | No | |
| invoice_number | VARCHAR | No | Unique |
| total | DECIMAL(10,2) | No | |
| paid_amount | DECIMAL(10,2) | No | |
| change | DECIMAL(10,2) | No | |
| payment_method | VARCHAR | No | |
| status | VARCHAR | No | "paid", "refunded" |
| created_at | TIMESTAMP | No | |

#### cash_drawer
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | |
| shift_id | UUID FK | No | |
| opening_cash | DECIMAL(10,2) | No | |
| closing_cash | DECIMAL(10,2) | Yes | |
| expected_cash | DECIMAL(10,2) | Yes | Calculated |
| variance | DECIMAL(10,2) | Yes | Difference |
| notes | TEXT | Yes | |

#### Settings Tables (13 tables)
Each settings module has its own table (e.g., `business_settings`, `restaurant_settings`, `menu_settings`, etc.).

**Example: business_settings**
| Column | Type |
|--------|------|
| id | UUID PK |
| key | VARCHAR |
| value | JSON/TEXT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

#### Reports Tables
- `daily_reports` - Aggregated daily stats
- `weekly_reports` - Aggregated weekly stats
- `monthly_reports` - Aggregated monthly stats
- `report_logs` - Audit trail of report generation

### 5.2 Entity Relationship Diagram (Text)

```
┌─────────────────────────────────────────────────────────────┐
│                        ORDERS DOMAIN                         │
└─────────────────────────────────────────────────────────────┘

User (cashier_id)
  └─ creates → Order
               ├─ has 1..N → OrderItem
               │             ├─ has 0..N → OrderItemAddOn
               │             └─ references → MenuItem
               ├─ has 1 → Table (optional, for dine-in)
               ├─ has 0..1 → Shift
               ├─ generates → Invoice
               ├─ generates → Receipt
               │             └─ has 1..N → ReceiptItem
               └─ has 1..N → OrderStatusLog

┌─────────────────────────────────────────────────────────────┐
│                     MENU DOMAIN                              │
└─────────────────────────────────────────────────────────────┘

Category
  └─ has 1..N → MenuItem
               ├─ has 0..N → MenuItemVariant
               └─ has 0..N → MenuItemAddon

┌─────────────────────────────────────────────────────────────┐
│                   OPERATIONS DOMAIN                          │
└─────────────────────────────────────────────────────────────┘

User (shift operator)
  └─ opens → Shift
            ├─ processes → Order(s)
            └─ manages → CashDrawer

Table
  ├─ has 0..1 → active_order_id
  └─ has 1..N → Order(s) (history)
```

### 5.3 Indexes

**Performance indexes (critical):**
- `orders.table_id, orders.status` - Active orders per table
- `orders.cashier_id` - Orders by cashier
- `orders.shift_id` - Orders in shift
- `order_items.order_id` - Items in order
- `receipts.order_id` - Receipt lookup
- `receipts.receipt_number` - Receipt by number
- `users.username` - Login lookup
- `tables.table_number` - Table lookup
- `menu_items.category_id` - Items in category
- `menu_items.is_active` - Active items

---

## 6. Authentication & Authorization

### 6.1 Login Flow

```
1. User enters username + password/PIN
   ↓
2. Frontend calls POST /api/v1/auth/login
   {
     "username": "cashier1",
     "password": "pass123"  // OR "pin": "1234"
   }
   ↓
3. Backend (AuthService.login):
   a) Find user by username
   b) Validate user.is_active
   c) Compare password hash OR PIN
   d) Update user.last_login
   e) Generate JWT tokens (access + refresh)
   f) Return { user, tokens }
   ↓
4. Frontend stores:
   - localStorage.setItem("comma_access_token", accessToken)
   - localStorage.setItem("comma_refresh_token", refreshToken)
   - localStorage.setItem("comma_session", { username, role, name, id })
   ↓
5. User navigated to /dashboard or /menu based on role
```

### 6.2 JWT Structure

**Access Token:**
```javascript
{
  "id": "uuid",
  "username": "cashier1",
  "role": "cashier",
  "iat": 1234567890,
  "exp": 1234567890 + 3600  // 1 hour
}
```

**Refresh Token:**
```javascript
{
  "id": "uuid",
  "username": "cashier1",
  "role": "cashier",
  "iat": 1234567890,
  "exp": 1234567890 + 86400*7  // 7 days
}
```

### 6.3 Roles & Permissions

| Role | Description | Accessible Pages | API Permissions |
|------|-------------|------------------|-----------------|
| **admin** | Full system access | All | All endpoints |
| **manager** | Operational management | Dashboard, Orders, Tables, Reports, Settings | All except user management |
| **cashier** | POS operations | Orders, Shifts, Receipts | Order CRUD, Shift CRUD, Receipt view |
| **guest** | Public ordering | Menu QR page | Public endpoints only |

**Per-Page Access Control:**
- `/login` → All (no auth required)
- `/menu` → All (public)
- `/menu/[tableId]` → All (public)
- `/dashboard/*` → admin, manager, cashier
- `/admin/settings` → admin only

### 6.4 Token Refresh Flow

```
1. Access token expires (1 hour)
2. Frontend detects expired token in API response
3. Frontend calls POST /api/v1/auth/refresh
   { "refreshToken": "..." }
4. Backend validates refresh token (not blacklisted)
5. Returns new access token + refresh token
6. Frontend updates localStorage
7. Retries original request with new token
```

### 6.5 Logout Flow

```
1. User clicks logout
2. Frontend calls POST /api/v1/auth/logout
   { "refreshToken": "..." }
3. Backend adds refresh token to blacklist (cache)
4. Frontend clears localStorage
5. Frontend redirects to /login
```

---

## 7. Order Flow

### 7.1 Order Lifecycle States

```
OPEN
  ↓
  (add/update items)
  ↓
  CONFIRMED (customer confirms)
  ↓
  PREPARING (kitchen starts)
  ↓
  READY (ready for pickup/serving)
  ↓
  COMPLETED (served)
  ↓
  (payment at checkout)
  ↓
  PAID (final state) → Receipt generated

Alternative paths:
  OPEN → CANCELLED (customer cancels)
  PAID → REFUNDED (refund issued)
```

### 7.2 Order Creation

**Endpoint:** `POST /api/v1/orders`

**Request:**
```json
{
  "type": "dine_in",
  "table_id": "uuid-of-table",
  "customer_name": "Ahmed",
  "notes": "No ice",
  "items": [
    {
      "menu_item_id": "uuid",
      "variant_id": "size_large",
      "quantity": 2,
      "addon_ids": ["addon-extra-shot"],
      "notes": "Hot"
    }
  ],
  "discount_type": "percentage",
  "discount_value": 10
}
```

**OrdersService.create() Logic:**
1. Get current shift (if cashier; optional for admin/manager)
2. Resolve table_id to table_number and table_id
3. Check for existing OPEN order on table (dine-in only)
4. Generate order_number (e.g., "ORD-20260602-001")
5. Create Order entity:
   - type, source, status=OPEN
   - table_id, customer_name, notes
   - tax_rate (15%), discount_type/value
   - cashier_id, shift_id
   - subtotal=0, tax_amount=0, total=0
6. Save order
7. If items provided, addItems()
8. Return full order with items

### 7.3 Adding Items to Order

**Endpoint:** `POST /api/v1/orders/{id}/items`

**Request:**
```json
{
  "items": [
    {
      "menu_item_id": "uuid",
      "variant_id": "size_large",
      "quantity": 2,
      "addon_ids": ["addon-1"],
      "notes": "Hot"
    }
  ]
}
```

**addItems() Logic:**
1. Fetch order (must be OPEN)
2. For each item:
   a) Fetch MenuItem
   b) Check is_active
   c) Resolve unit_price (base + variant adjustment)
   d) Create OrderItem
   e) For each addon:
      - Create OrderItemAddOn
   f) Update order subtotal
3. Recalculate order totals:
   - subtotal = Σ(item.quantity × item.unit_price + addons)
   - discount_amount = subtotal × discount_value (if %)
   - tax_amount = (subtotal - discount) × tax_rate
   - total = subtotal - discount + tax + service_charge

### 7.4 Status Transitions

**Endpoint:** `PATCH /api/v1/orders/{id}/status`

**Request:**
```json
{
  "new_status": "preparing",
  "notes": "Kitchen started"
}
```

**changeStatus() Logic:**
1. Fetch order
2. Validate status transition is allowed
3. Update order.status
4. Create OrderStatusLog entry
5. If status == READY:
   - Send notification (if configured)
6. Return updated order

### 7.5 Checkout & Payment

**Endpoint:** `POST /api/v1/orders/{id}/checkout`

**Request:**
```json
{
  "discount_amount": 50,
  "payments": [
    { "method": "cash", "amount": 450 }
  ],
  "waiter_name": "Ali"
}
```

**checkoutTable() Flow:**
1. Fetch order
2. Apply discount to order
3. Calculate final total
4. InvoicesService.processPayment():
   a) Create Invoice
   b) Record payments
   c) Calculate change
   d) Set order.status = PAID
   e) Set table.status = AVAILABLE
   f) Clear table.active_order_id
5. ReceiptService.generateReceipt():
   a) Create Receipt with receipt_number
   b) Copy order items to ReceiptItems
   c) Include business info
6. Return { invoice, change, receipt }

### 7.6 Sequence Diagram

```
Guest/Cashier
    │
    ├─(1) POST /orders (create)
    │        │
    │        └─→ OrdersService.create()
    │             ├─ generate order_number
    │             ├─ assign table (if dine-in)
    │             └─ save Order (status=OPEN)
    │
    ├─(2) POST /orders/{id}/items (add items)
    │        │
    │        └─→ OrdersService.addItems()
    │             ├─ create OrderItem(s)
    │             ├─ add addons
    │             └─ recalculate totals
    │
    ├─(3) PATCH /orders/{id}/status (confirm)
    │        │
    │        └─→ OrdersService.changeStatus()
    │             ├─ validate transition
    │             └─ log status change
    │
    ├─(4) PATCH /orders/{id}/status (preparing)
    │        │
    │        └─→ Kitchen notified (KDS)
    │
    ├─(5) PATCH /orders/{id}/status (ready)
    │        │
    │        └─→ Notification sent
    │
    ├─(6) POST /orders/{id}/checkout
    │        │
    │        ├─→ OrdersService.checkoutTable()
    │        ├─→ InvoicesService.processPayment()
    │        │   └─ Create Invoice
    │        │   └─ Set order.status = PAID
    │        │   └─ Set table.status = AVAILABLE
    │        │
    │        └─→ ReceiptService.generateReceipt()
    │             └─ Create Receipt & ReceiptItems
    │             └─ Print/Display receipt
    │
    └─(7) GET /receipts/{id} (view receipt)
             │
             └─→ ReceiptService.findById()
```

---

## 8. Table Management Flow

### 8.1 Table Lifecycle States

```
AVAILABLE (no active order)
    ↓ (customer arrives, create order)
    ↓
OCCUPIED (order.status != PAID)
    ↓ (order paid)
    ↓
AVAILABLE

RESERVED (future feature)
    ↓
    ↓
OCCUPIED
    ↓
AVAILABLE
```

### 8.2 Table Operations

**Create Table:**
```json
POST /api/v1/tables
{
  "table_number": 5,
  "capacity": 4,
  "location": "Window"
}
```

**Assign Order to Table:**
- When order.type = "dine_in" and table_id provided:
  - Update table.status = "occupied"
  - Set table.active_order_id = order.id
  
**Release Table:**
- When order.status = "PAID":
  - Update table.status = "available"
  - Clear table.active_order_id

**Get Active Order for Table:**
```
GET /api/v1/orders/table/{tableId}/active
Returns: Order (or 404 if no active order)
```

**Get or Create Order for Table:**
```
POST /api/v1/orders/table/{tableId}/open-or-create
If table.active_order_id exists → return existing
Else → create new OPEN order → return it
```

### 8.3 Table Status Dashboard

**Table Grid Component:**
- Display all tables as cards/grid
- Color coding: Green (available), Red (occupied), Gray (reserved)
- Click table → see active order details
- Click order → open OrderPanel
- Assign order, see items, apply discounts, checkout

---

## 9. Receipt & Invoice System

### 9.1 Receipt Generation

**Triggered by:** `POST /api/v1/orders/{id}/checkout`

**Process:**
```
1. Order marked as PAID
2. ReceiptService.generateReceipt(order, cashierName, waiterName, paymentMethod)
3. Generate unique receipt_number (e.g., "RCP-20260602-001")
4. Create Receipt entity:
   - Copy order data
   - Include cashier/waiter names
   - Include business info (from settings)
   - Set payment_method
5. For each non-voided OrderItem:
   - Create ReceiptItem
   - Calculate line_total = qty × unit_price + addons
6. Save and return Receipt
```

**Receipt Fields:**
- receipt_number (unique)
- order_number, order_id
- table_number, table_id
- cashier_name, waiter_name
- subtotal, discount, tax, service_charge, total
- payment_method
- business_name, business_address, business_phone
- tax_id, footer_message
- created_at (timestamp)

### 9.2 Invoice Generation

**Created automatically during checkout:**
```
InvoicesService.processPayment(orderId, userId, { payments: [...] })
1. Find Order
2. For each payment:
   - Record method & amount
   - Create Invoice record
3. Calculate change = total_paid - order.total
4. Set invoice.status = "paid"
5. Return { invoice, change }
```

**Invoice Fields:**
- invoice_number (unique)
- order_id, order_number
- total, paid_amount, change
- payment_method (cash, card, etc.)
- payment_status (paid, refunded, pending)
- created_at

### 9.3 Receipt Printing

**Frontend Component:** `ReceiptPrinter.tsx`
```
1. Fetch receipt by ID or order ID
2. Format for 80mm thermal printer
3. Show on screen
4. Call window.print() or send to printer API
```

**Print Layout:**
```
═══════════════════════════════════════
              COMMA CAFÉ
      Premium Café & Lounge
            Cairo, Egypt
═══════════════════════════════════════

Receipt #: RCP-20260602-001
Order #:   ORD-20260602-005
Date:      2026-06-02 14:30
Table:     5

───────────────────────────────────────
Cappuccino (Large)          2    90.00
  + Extra Shot              2     8.00
Iced Coffee                 1    50.00
───────────────────────────────────────

Subtotal:                       238.00
Discount (10%):                -23.80
───────────────────────────────────────
Subtotal after discount:       214.20
Tax (15%):                      32.13
Service Charge (0%):             0.00
───────────────────────────────────────
TOTAL:                         246.33

Payment Method: Cash
Paid:                          246.33
Change:                           0.00

Cashier: Ahmed
Waiter: Ali
───────────────────────────────────────
Thank you for your visit!
Visit us again soon.
═══════════════════════════════════════
```

---

## 10. Dashboard & Analytics

### 10.1 KPIs Displayed

**Real-time Metrics:**
- Total Revenue (today)
- Total Orders (today)
- Average Order Value
- Total Items Sold
- Active Tables
- Open Orders

**Charts & Visualizations:**
- Revenue Trend (line chart)
- Category Performance (bar chart)
- Top Items by Quantity (table/list)
- Order Status Breakdown (pie/donut chart)
- Hourly Distribution (line chart)

### 10.2 Report Types

**Daily Reports:**
- Date range: Today
- Metrics: Revenue, order count, category breakdown, top items
- Endpoint: `GET /api/v1/reports/daily`

**Weekly Reports:**
- Date range: Last 7 days
- Metrics: Daily comparison, revenue trend
- Endpoint: `GET /api/v1/reports/weekly`

**Monthly Reports:**
- Date range: Month
- Metrics: Daily, category, payment method breakdown
- Endpoint: `GET /api/v1/reports/monthly`

### 10.3 Dashboard Queries

```
DashboardService.getStats() returns:
{
  total_revenue: 2500,
  total_orders: 45,
  average_order_value: 55.56,
  total_items_sold: 125,
  active_tables: 3,
  open_orders: 5,
  category_performance: [
    { category: "Coffees", revenue: 1200, percentage: 48 },
    { category: "Cold Drinks", revenue: 900, percentage: 36 },
    { category: "Food", revenue: 400, revenue: 16 }
  ],
  top_items: [
    { name: "Cappuccino", quantity: 45, revenue: 2025 },
    { name: "Espresso", quantity: 38, revenue: 1330 }
  ],
  order_status: {
    open: 5,
    preparing: 3,
    ready: 2,
    completed: 35
  }
}
```

---

## 11. API Documentation

### 11.1 Authentication Endpoints

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/v1/auth/login` | None | LoginDto | { user, tokens } |
| POST | `/api/v1/auth/refresh` | Token | { refreshToken } | { accessToken, refreshToken } |
| POST | `/api/v1/auth/logout` | Token | { refreshToken } | { message } |
| GET | `/api/v1/auth/me` | Token | - | User |

### 11.2 Orders Endpoints

| Method | Endpoint | Auth | Body | Response | Role |
|--------|----------|------|------|----------|------|
| POST | `/api/v1/orders` | JWT | CreateOrderDto | Order | Cashier+ |
| GET | `/api/v1/orders` | JWT | Pagination + filters | { data: Order[], total } | Cashier+ |
| GET | `/api/v1/orders/active` | JWT | - | Order[] | Cashier+ |
| GET | `/api/v1/orders/{id}` | JWT | - | Order | Cashier+ |
| POST | `/api/v1/orders/table/{tableId}/open-or-create` | JWT | - | Order | Cashier+ |
| GET | `/api/v1/orders/table/{tableId}/active` | JWT | - | Order | Cashier+ |
| PATCH | `/api/v1/orders/{id}` | JWT | UpdateOrderDto | Order | Cashier+ |
| PATCH | `/api/v1/orders/{id}/status` | JWT | ChangeOrderStatusDto | Order | Cashier+ |
| DELETE | `/api/v1/orders/{id}` | JWT | CancelOrderDto | { message } | Manager+ |
| POST | `/api/v1/orders/{id}/items` | JWT | AddOrderItemsDto | Order | Cashier+ |
| PATCH | `/api/v1/orders/{id}/items/{itemId}` | JWT | UpdateOrderItemDto | Order | Cashier+ |
| DELETE | `/api/v1/orders/{id}/items/{itemId}` | JWT | - | Order | Cashier+ |
| POST | `/api/v1/orders/{id}/items/{itemId}/void` | JWT | VoidOrderItemDto | Order | Cashier+ |
| POST | `/api/v1/orders/{id}/checkout` | JWT | CheckoutDto | { invoice, change, receipt } | Cashier+ |

### 11.3 Tables Endpoints

| Method | Endpoint | Auth | Body | Response | Role |
|--------|----------|------|------|----------|------|
| POST | `/api/v1/tables` | JWT | CreateTableDto | Table | Admin |
| GET | `/api/v1/tables` | JWT | - | Table[] | Cashier+ |
| GET | `/api/v1/tables/{id}` | JWT | - | Table | Cashier+ |
| PATCH | `/api/v1/tables/{id}` | JWT | UpdateTableDto | Table | Manager+ |
| DELETE | `/api/v1/tables/{id}` | JWT | - | { message } | Admin |

### 11.4 Receipts Endpoints

| Method | Endpoint | Auth | Body | Response | Role |
|--------|----------|------|------|----------|------|
| GET | `/api/v1/receipts` | JWT | Pagination + filters | { data: Receipt[], total } | Cashier+ |
| GET | `/api/v1/receipts/{id}` | JWT | - | Receipt | Cashier+ |
| POST | `/api/v1/receipts/{orderId}/generate` | JWT | - | Receipt | Cashier+ |
| POST | `/api/v1/receipts/{id}/print` | JWT | - | { status } | Cashier+ |

### 11.5 Other Endpoints

**Shifts:**
- `GET /api/v1/shifts` - List all shifts
- `GET /api/v1/shifts/current` - Get current open shift
- `POST /api/v1/shifts/open` - Open shift
- `POST /api/v1/shifts/close` - Close shift

**Menu:**
- `GET /api/v1/categories` - List categories
- `GET /api/v1/menu-items` - List items
- `POST /api/v1/menu-items` - Create item (Admin)
- `PATCH /api/v1/menu-items/{id}` - Update item (Admin)

**Users:**
- `GET /api/v1/users` - List users (Admin)
- `POST /api/v1/users` - Create user (Admin)
- `PATCH /api/v1/users/{id}` - Update user (Admin)

**Reports:**
- `GET /api/v1/reports/daily` - Daily report
- `GET /api/v1/reports/weekly` - Weekly report
- `GET /api/v1/reports/monthly` - Monthly report

**Dashboard:**
- `GET /api/v1/dashboard/stats` - Dashboard metrics

**Settings:**
- `GET /api/v1/settings/*` - Get settings by category
- `PATCH /api/v1/settings/*` - Update settings

**Public (no auth):**
- `GET /public/categories` - Menu categories
- `GET /public/menu-items` - Menu items
- `POST /public/orders` - Create order from QR code

---

## 12. Recent Changes Analysis

### 12.1 Recently Added Features

**Table-Based Order & Receipt System (Latest 5 commits)**

| Commit | Date | Feature | Impact |
|--------|------|---------|--------|
| bd81a37 | Jun 2 | Add complete table order workflow UI | High - Frontend UI for table ordering |
| 0f11658 | Jun 2 | Wire receipt generation into payment flow | High - Receipts auto-generated on payment |
| 5bc38c3 | Jun 2 | Add missing ALTER migrations for tables and order status enum | Critical - DB schema alignment |
| 0790750 | Jun 2 | Implement Table-Based Order & Receipt System | Critical - Core business feature |
| 3776afd | Jun 2 | Add final validation report - Phase 4 complete | Documentation |

### 12.2 Files Involved

**Backend Tables Entity:**
- Added `active_order_id` column (tracks current order per table)
- Added `TableStatus` enum (available, occupied, reserved)
- Foreign key to orders

**Orders Entity:**
- New relationships with Receipt, OrderStatusLog
- Status transitions: OPEN → CONFIRMED → PREPARING → READY → COMPLETED → PAID
- Soft tracking of refunded/cancelled states

**Receipts System:**
- New Receipt & ReceiptItem entities
- Receipt generation from paid orders
- Business info + payment details inclusion
- One-to-one mapping with Order

**Order Checkout Flow:**
- New endpoint: `POST /orders/{id}/checkout`
- Unified checkout: apply discounts → calculate totals → process payment → generate receipt
- Table auto-release on payment

**Frontend Components:**
- `TableOrderPanel.tsx` - Display active table order
- `ReceiptPrinter.tsx` - Receipt display/printing
- Enhanced `OrdersTable.tsx` with checkout UI
- Table grid with order assignment

**API Proxy:**
- New route `app/api/v1/settings/[...slug]` for frontend settings forwarding

### 12.3 Business Purpose

- **Table Management:** Assign orders to physical tables, track occupancy
- **Receipt Generation:** Automatic receipt creation from paid orders (required for POS compliance)
- **Checkout Workflow:** Complete payment → release table → print receipt flow
- **Operational Efficiency:** Streamline dine-in ordering, reduce manual steps

### 12.4 Technical Debt & Known Issues

*From recent commits:*
- Multiple "FIX" commits suggest schema alignment issues (migrations)
- Duplicate API prefix issues required fixing (`api/v1` being added twice)
- Restaurant entity references removed (cleanup)
- TypeScript type strictness issues in forms (required explicit string casting)
- Read-only field handling in IntegrationSettingsSection (no-op onChange handlers)

---

## 13. Risk Assessment

### 13.1 Incomplete Implementations

| Item | Severity | Notes |
|------|----------|-------|
| **Refund Processing** | Medium | Invoice marked as "refunded" but no refund logic exists |
| **KDS Integration** | Medium | No kitchen display system connected |
| **Payment Gateway** | Medium | Only mock payment methods, no Stripe/PayPal integration |
| **Email Notifications** | Low | Settings include email config but not implemented |
| **Receipt PDF Export** | Low | No actual PDF generation, only HTML print |
| **Multi-Language** | Medium | i18n structure exists but English/Arabic sync not validated |
| **Role-Based Filtering** | Low | Some endpoints don't enforce role checks (public endpoints intentional?) |

### 13.2 Dead Code

| File | Issue | Impact |
|------|-------|--------|
| `api-server.js` | Mock server, not used in production | Low - development only |
| Unused settings modules | Some settings sections may not be wired to backend | Low |
| `seed-menu.js` | Seed file, may not run in prod | Low |

### 13.3 Duplicate Logic

| Area | Issue |
|------|-------|
| **Order Total Calculation** | Performed in multiple places (OrdersService, checkoutTable, OrderItem calculations) |
| **Status Validation** | Order status transitions checked in multiple endpoints |
| **Table Status Updates** | Table availability updated in multiple services |

### 13.4 Technical Debt

| Category | Items |
|----------|-------|
| **Database** | 25+ migrations (no rollback testing evident) |
| **Types** | Frontend has some `any` types in API responses |
| **Error Handling** | Generic error messages, limited debugging context |
| **Tests** | No test files visible in codebase |
| **Migrations** | Schema evolved incrementally, no optimization pass |
| **Frontend State** | Context-based but no global state library (Redux/Zustand) |
| **Caching** | Memory-based only, no Redis integration |

### 13.5 Potential Bugs

| Issue | Severity | Reason |
|-------|----------|--------|
| **Concurrent Checkout** | Medium | Two simultaneous checkouts on same order could cause race condition |
| **Table Reassignment** | Medium | No validation preventing table reassignment mid-order |
| **Addon Calculation** | Low | Addons subtotal calculation may not handle quantity correctly |
| **Discount Type Mismatch** | Low | "percentage" vs "percent" string mismatch possible |
| **Shift Validation** | Low | Cashier can create orders without shift in some flows |
| **Receipt Duplicate** | Low | No uniqueness constraint prevents receipt duplication per order |
| **Order Number Format** | Low | Order numbering logic not validated for uniqueness across date boundaries |

### 13.6 Security Concerns

| Issue | Severity | Status |
|-------|----------|--------|
| **No HTTPS Enforcement** | Medium | CORS allows localhost only in dev |
| **Token Blacklist TTL** | Medium | Blacklist uses memory cache, not persistent |
| **Password Requirements** | Medium | No password complexity validation |
| **SQL Injection** | Low | TypeORM parameterized, safe |
| **CSRF** | Low | SPA, no cookie-based auth (JWT instead) |
| **XSS** | Low | Next.js sanitization + React escaping |
| **Input Validation** | Medium | ValidationPipe exists but not all DTOs validated |

### 13.7 Performance Concerns

| Issue | Impact |
|-------|--------|
| **No Pagination Default** | Could load all orders on startup |
| **N+1 Queries** | Order fetches may not have relations pre-loaded |
| **Cache Invalidation** | No invalidation strategy for settings cache |
| **Report Generation** | Heavy aggregation queries not optimized |
| **Large Receipt Items** | Receipt printing could be slow if 100+ items |

---

## 14. Recommendations

### 14.1 KEEP (Working Well)

✅ **JWT Authentication Flow**
- Secure token-based auth with refresh mechanism
- Proper TTL management
- Roles-based guards in place

✅ **Table-Based Order Management**
- Solid entity relationships
- Clear order lifecycle
- Table-order mapping functional

✅ **Receipt Generation**
- Automatic receipt creation from orders
- Business info included
- Ready for thermal printer integration

✅ **Settings Architecture**
- 13 distinct modules for operational config
- Extensible design

✅ **Frontend Component Structure**
- Good separation of concerns
- Provider-based state management
- Reusable components

### 14.2 REFACTOR (Design Improvements)

🔄 **Order Total Calculation**
- **Issue:** Calculated in multiple places (OrdersService.create, checkoutTable, OrderItem mapping)
- **Recommended:** Create `OrderCalculatorService` with single `calculateTotals(order)` method
- **Impact:** Eliminates bugs, ensures consistency
- **Files:** `POS/src/modules/orders/services/order-calculator.service.ts` (new)

🔄 **Status Validation & Transitions**
- **Issue:** Status transition logic scattered across services
- **Recommended:** Create `OrderStatusMachine` class defining allowed transitions
- **Impact:** Centralize business rules, easier to maintain
- **Files:** `POS/src/modules/orders/domain/order-status.machine.ts` (new)

🔄 **Table Management**
- **Issue:** Table status updates happen in multiple endpoints
- **Recommended:** Create `TableStateService` managing status transitions
- **Impact:** Prevent concurrent state issues
- **Files:** `POS/src/modules/tables/services/table-state.service.ts` (new)

🔄 **Error Handling**
- **Issue:** Generic error messages with limited context
- **Recommended:** Create custom exceptions (OrderNotFound, InvalidStatusTransition, etc.)
- **Impact:** Better debugging, clearer API errors
- **Files:** `POS/src/common/exceptions/` (new folder)

🔄 **Frontend API Client**
- **Issue:** `lib/api.ts` is very large (250+ lines)
- **Recommended:** Split by feature (`api/orders.ts`, `api/users.ts`, etc.)
- **Impact:** Better code organization, easier to maintain
- **Files:** `lib/api/` (new folder with feature-based files)

🔄 **Settings Configuration**
- **Issue:** 13 separate settings entities, potential consistency issues
- **Recommended:** Use single `SettingValue` table with `key-value` design
- **Impact:** Simpler schema, easier querying, less duplication
- **Files:** Requires migration, impacts SettingsModule

### 14.3 REMOVE (Dead/Unused Code)

❌ **api-server.js**
- **Status:** Mock server, not used in production
- **Action:** Remove or archive
- **Impact:** Reduce confusion, smaller repo

❌ **Unused Seed Files**
- **Status:** `seed-menu.js`, `reset-passwords.js` may not run
- **Action:** Test, document, or remove
- **Impact:** Clarity

❌ **Old Migration Files** (if any)
- **Status:** Check for rolled-back migrations
- **Action:** Remove old `.ts` files post-squash
- **Impact:** Cleaner migrations folder

### 14.4 HIGH RISK (Must Address)

🚨 **Concurrency Control for Checkout**
- **Issue:** Two simultaneous `POST /orders/{id}/checkout` could corrupt state
- **Recommended:** Add `version` column to Order, use optimistic locking
- **Effort:** Medium
- **Priority:** High

🚨 **Persistent Token Blacklist**
- **Issue:** Logout blacklist uses memory cache, lost on restart
- **Recommended:** Use Redis or database table for blacklist
- **Effort:** Low
- **Priority:** Medium

🚨 **Input Validation**
- **Issue:** Not all DTOs have comprehensive validators
- **Recommended:** Add validation decorators to all DTOs
- **Effort:** Medium
- **Priority:** Medium

🚨 **Refund Processing Logic**
- **Issue:** Invoice supports `refunded` status but no refund logic exists
- **Recommended:** Implement `InvoicesService.refund(invoiceId)` with:
  - Reverse transaction
  - Update order status to REFUNDED
  - Release table
  - Create refund receipt
- **Effort:** Medium
- **Priority:** High (if refunds needed)

🚨 **Receipt Duplicate Prevention**
- **Issue:** Multiple receipts per order possible
- **Recommended:** Add unique constraint on `(order_id, payment_method)` or implement idempotent endpoint
- **Effort:** Low
- **Priority:** Medium

🚨 **Addon Quantity Calculation**
- **Issue:** Addon price × quantity not explicitly validated
- **Recommended:** Review `ReceiptService.generateReceipt()` line 57-59
- **Effort:** Low
- **Priority:** Low

---

## 15. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Next.js)                      │
├─────────────────────────────────────────────────────────────────┤
│  [Login] [Menu] [Dashboard] [Admin Settings] [Reports] [Receipts]│
│         ├─ AuthProvider (JWT tokens)                             │
│         ├─ LangProvider (EN/AR)                                  │
│         ├─ DashboardProvider (stats)                             │
│         └─ OrdersProvider (orders state)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP/REST
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   API GATEWAY (api-server.js)                    │
│              (Mock in dev, would be reverse proxy)               │
├─────────────────────────────────────────────────────────────────┤
│  CORS handling, request logging, rate limiting                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                 NESTJS BACKEND (Port 3000)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GUARDS & INTERCEPTORS                                   │   │
│  │  ├─ JwtAuthGuard (token validation)                     │   │
│  │  ├─ RolesGuard (role-based access)                      │   │
│  │  ├─ TransformInterceptor (response wrapping)            │   │
│  │  └─ LoggingInterceptor (request logging)                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ▲                                     │
│                           │                                     │
│  ┌────────┬──────────┬───┴────┬──────────┬──────────────────┐  │
│  │        │          │        │          │                  │  │
│  ▼        ▼          ▼        ▼          ▼                  ▼  │
│ Auth   Users      Orders   Tables    Receipts         Dashboard │
│ Module Module     Module   Module     Module            Module  │
│  │       │         │        │         │                   │     │
│  └───────┴─────────┴────────┴─────────┴───────────────────┘   │
│                           ▲                                     │
│                    Settings Modules (13)                        │
│                    - Business                                   │
│                    - Restaurant                                 │
│                    - Menu                                       │
│                    - Table                                      │
│                    - OrderStatus                                │
│                    - Payment                                    │
│                    - UserManagement                             │
│                    - Shift                                      │
│                    - Notification                               │
│                    - Report                                     │
│                    - Appearance                                 │
│                    - Security                                   │
│                    - Monitoring                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SERVICES LAYER                                            │  │
│  │ ├─ AuthService (JWT generation, validation)              │  │
│  │ ├─ OrdersService (order lifecycle, checkout)             │  │
│  │ ├─ ReceiptService (receipt generation)                   │  │
│  │ ├─ InvoicesService (payment processing)                  │  │
│  │ ├─ TablesService (table management)                      │  │
│  │ ├─ ReportsService (analytics aggregation)                │  │
│  │ ├─ DashboardService (dashboard metrics)                  │  │
│  │ ├─ UsersService (user management)                        │  │
│  │ ├─ ShiftsService (shift management)                      │  │
│  │ ├─ MenuItemsService (product catalog)                    │  │
│  │ ├─ AddonsService (customization)                         │  │
│  │ └─ SettingsServices (13 specialized services)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ▲                                     │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ TypeORM
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    POSTGRESQL DATABASE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USERS → SHIFTS → ORDERS → ORDER_ITEMS → ORDER_ITEM_ADDONS    │
│           ↓                  ↓              ↓                    │
│           │         ORDER_STATUS_LOGS     │                    │
│           │                 │              │                    │
│           └─────────────────┴──────────────┘                    │
│                           ▲                                      │
│                           │                                      │
│      INVOICES ←─────────────────────→ RECEIPTS ← RECEIPT_ITEMS │
│                                                                  │
│  TABLES ←─────────────────────────────────────────→ ORDERS      │
│                                                                  │
│  CATEGORIES → MENU_ITEMS → MENU_ITEM_VARIANTS                  │
│                        ↓                                         │
│                   MENU_ITEM_ADDONS ← ADDONS                     │
│                                                                  │
│  CASH_DRAWER ← SHIFTS                                           │
│                                                                  │
│  REPORTS (DAILY, WEEKLY, MONTHLY)                               │
│  REPORT_LOGS (audit trail)                                      │
│                                                                  │
│  SETTINGS (13 tables for configuration)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Deployment & Environment

### 16.1 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/pos_db
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pos_db

# API
API_PREFIX=api/v1
PORT=3000
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000

# JWT
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=604800

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
FRONTEND_URL=http://localhost:3001

# Cache
CACHE_TTL=600

# Throttle
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 16.2 Startup Commands

```bash
# Development (both frontend + backend)
npm run dev:all

# Backend only
npm run api

# Frontend only
npm run dev

# Production
npm run build
npm run start:prod
```

---

## 17. Testing Coverage

**Current Status:** No visible test files in codebase

**Recommended Test Coverage:**

- [ ] Auth Service (login, token generation, validation)
- [ ] Orders Service (create, add items, checkout, status transitions)
- [ ] Receipt Service (generation, retrieval)
- [ ] Tables Service (status updates, order assignment)
- [ ] Guards & Interceptors
- [ ] Frontend components (critical paths)
- [ ] API endpoints (integration tests)

---

## 18. Future Enhancements

1. **Mobile POS App** - React Native version for iOS/Android
2. **Kitchen Display System (KDS)** - Real-time order routing to kitchen
3. **Payment Gateway Integration** - Stripe, PayPal, local payment methods
4. **Customer Management** - Loyalty programs, repeat customer tracking
5. **Inventory Management** - Stock tracking per menu item
6. **Multi-Location Support** - Franchise/chain management
7. **Advanced Analytics** - Predictive analytics, customer behavior
8. **Delivery Management** - Route optimization, driver tracking
9. **WhatsApp/SMS Integration** - Order notifications
10. **Real-time Notifications** - WebSocket for live updates

---

## Summary

This is a mature, production-ready POS system with well-structured backend (NestJS) and frontend (Next.js) layers. Core order management, table tracking, and receipt generation are solid. Main gaps are in payment integration, testing coverage, and some incomplete features (KDS, refunds). The architecture supports multi-language (EN/AR) and role-based access. Recent focus was on table-based ordering workflow, which is now complete. Recommended next steps: add comprehensive tests, implement refund logic, and integrate real payment gateways.

**Last Updated:** June 2, 2026  
**Repository Status:** Clean / Ready for Development
