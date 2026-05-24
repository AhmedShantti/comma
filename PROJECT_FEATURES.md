# Comma POS System - Features Documentation

## Overview
Comma is a modern Point of Sale (POS) system built with Next.js 15 (frontend) and NestJS (backend), featuring real-time shift management, order tracking, and comprehensive reporting.

---

## Core Features

### 1. Authentication & Users
- JWT-based authentication
- User roles: Admin, Manager, Cashier
- User profile management
- PIN and password authentication
- Last login tracking
- Active/inactive user status

### 2. Shift Management
- **Open Shift**: Create new shift with opening cash amount
- **Close Shift**: Complete shift with closing cash and notes
- **View Shifts**: List all shifts with filtering (open/closed)
- **Active Shifts**: Real-time view of all active shifts across cashiers
- **Shift Details**: View complete shift information including:
  - Opening/closing cash
  - Duration
  - Cash difference
  - Associated user
  - Shift notes
  - **Order Summaries**: Total orders, total amount, total items
  - **Order List**: Paginated completed orders from the shift

### 3. Order Management
- **Create Orders**: Multiple order types (dine-in, takeaway, delivery)
- **Order Statuses**: open → confirmed → preparing → ready → completed/cancelled/refunded
- **Order Tracking**: Real-time order status updates
- **Order Items**: Add menu items to orders with quantities
- **Discounts**: Percentage or fixed amount discounts
- **Taxes**: Configurable tax rates
- **Service Charges**: Automatic service charge calculation
- **Customer Info**: Track customer names, phone, delivery address
- **Order Cancellation**: Cancel orders with reason tracking
- **Order History**: Complete order lifecycle tracking

### 4. Menu Management
- **Categories**: Organize menu items by category (AR/EN names)
- **Menu Items**: Product catalog with:
  - Bilingual names (Arabic/English)
  - Descriptions
  - Base pricing
  - Images
  - Tax groups
  - Active/inactive toggle
  - Sort ordering
- **Variants**: Size/option variants with price adjustments
- **Addons**: Additional items for menu items (charged separately)

### 5. Tables
- **Table Management**: Create and manage dining tables
- **Table Status**: Available, occupied, reserved
- **Table Capacity**: Configure seating capacity
- **Table Location**: Organize by location/section
- **Table Linking**: Link orders to tables for dine-in tracking

### 6. Payments & Invoicing
- **Payment Methods**: Cash, card, wallet, online
- **Invoices**: Generate invoices for orders
- **Payment Processing**: Record payment transactions
- **Refunds**: Process partial and full refunds
- **Payment History**: Track all payment records

### 7. Cash Drawer Management
- **Opening Balance**: Initial cash amount
- **Cash In/Out**: Track cash transactions
- **Expected vs Actual**: Balance discrepancy detection
- **Drawer Reconciliation**: Notes on balance differences
- **Shift Integration**: Link cash drawer to shifts

### 8. Reporting & Analytics
- **Daily Reports**: Daily sales metrics, product breakdown, hourly distribution
- **Weekly Reports**: Aggregated weekly performance, top products, growth rates
- **Monthly Reports**: Comprehensive monthly analytics, customer stats, trends
- **Report Types**: Revenue, orders, profit, customer metrics
- **Report Generation**: Automated and manual report generation
- **Report Status Tracking**: Log report generation history

### 9. Dashboard & Monitoring
- **Overview**: Key metrics at a glance
- **Real-time Updates**: Live shift and order monitoring
- **Active Cashiers**: See who's currently on shift
- **Revenue Tracking**: Current shift revenue
- **Quick Actions**: Open/close shift buttons
- **Status Indicators**: Visual feedback on system state

### 10. Settings & Configuration
- **System Settings**: Configurable key-value store
- **Business Settings**: Tax rates, service charges, discounts
- **User Management**: Manage user access and roles

---

## Recent Enhancements (Latest)

### Shift-Order Linking
- Completed orders are now linked to shifts at the database level
- **Order Summaries**: When closing a shift, system automatically:
  - Counts total orders completed in that shift
  - Sums total revenue from all completed orders
  - Counts total items sold
- **Order Summary Display**: Shift details view shows:
  - Total Orders (count)
  - Orders Amount (total revenue)
  - Total Items (item count)
- **Order List**: View paginated list of all completed orders from a shift
  - Order number, type, customer name, amount, completion time
  - Pagination controls for large order lists

---

## Technical Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Custom Hooks
- **API Client**: Fetch with Bearer token auth
- **Auth**: localStorage (comma_access_token)

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (TypeORM)
- **Authentication**: JWT with passport
- **Validation**: DTOs with decorators
- **Caching**: Redis integration
- **Rate Limiting**: Throttler module

### Database
- **ORM**: TypeORM
- **Migrations**: Automated migration system
- **Entities**: 15+ core entities with relationships
- **Foreign Keys**: Referential integrity

---

## File Structure

```
comma/
├── app/dashboard/shifts/          # Shift page & dialogs
├── components/dashboard/shifts/   # Shift UI components
│   ├── ShiftOrders.tsx            # NEW: Order list component
│   ├── ShiftDetailsDialog.tsx      # UPDATED: Added order stats
│   ├── hooks/useShifts.ts         # Shifts data hook
│   └── ...other components
├── lib/api/shifts.ts              # API client
├── POS/
│   └── src/modules/
│       ├── shifts/                # Shift business logic
│       ├── orders/                # Order management
│       ├── users/                 # User management
│       ├── payments/              # Payment processing
│       ├── reports/               # Reporting engine
│       └── ...other modules
```

---

## Deployment

- **Frontend**: Deployed to Render (comma-7ogy.onrender.com)
- **Backend**: Deployed to Render
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens stored in localStorage

---

## Key Workflows

### 1. Daily Shift Workflow
1. Cashier opens shift (provides opening cash)
2. System creates shift record linked to user
3. Orders created during shift are linked to shift_id
4. When shift closes, system calculates order totals
5. Shift details display comprehensive statistics

### 2. Order Processing
1. Create order (select type, table, customer)
2. Add items (menu items, variants, addons)
3. Apply discounts/taxes
4. Confirm order
5. Process payment
6. Mark as completed (auto-linked to current shift)

### 3. Reporting
1. System automatically captures order data
2. Daily/weekly/monthly reports generated
3. Aggregated metrics available in dashboard
4. Historical data retained for analysis

---

## Security Features

- JWT-based authentication
- Bearer token in Authorization header
- Role-based access control (RBAC)
- Password hashing
- PIN authentication option
- CORS protection
- Rate limiting
- SQL injection prevention (ORM)

---

## Performance Optimizations

- Pagination on lists (orders, shifts, reports)
- Query optimization with relationships
- Caching layer (Redis)
- Indexed database columns
- Efficient calculations (shift totals on close)
- Client-side component memoization

---

## Future Enhancement Ideas

- Real-time notifications (WebSocket)
- Inventory management
- Kitchen display system (KDS)
- Mobile app
- Multi-location support
- Advanced analytics with charts
- Loyalty program integration
- Marketing tools
- Third-party payment integrations

---

## Status

✅ All core features implemented and tested
✅ Shift-order linking complete
✅ Order summaries functional
✅ Deployed to production
🔄 Ready for user testing
