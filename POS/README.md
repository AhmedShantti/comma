# Restaurant & Café POS System - NestJS Backend

A complete, production-ready Point of Sale (POS) system for restaurants and cafés built with NestJS, TypeORM, and PostgreSQL.

## Features

- **User Management & Authentication**: JWT-based authentication with support for password and PIN login
- **Role-Based Access Control**: Admin, Manager, and Cashier roles
- **Shift Management**: Track user shifts with opening/closing cash
- **Menu Management**: Categories, menu items with variants, and add-ons
- **Order Management**: Complete order lifecycle with status tracking
- **Payment Processing**: Multiple payment methods (cash, card, wallet, online)
- **Invoicing**: Automatic invoice generation with receipt data
- **Reports**: Daily and weekly sales reports
- **Cash Drawer**: Track cash transactions and discrepancies
- **Settings**: Configurable application settings

## Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS (latest)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger
- **Caching**: Redis with @nestjs/cache-manager
- **Rate Limiting**: @nestjs/throttler
- **Config**: @nestjs/config
- **Testing**: Jest

## Project Structure

```
src/
├── main.ts
├── app.module.ts
├── config/                     # Configuration modules
├── common/                     # Shared code
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── dto/
│   ├── enums/
│   └── utils/
└── modules/                    # Feature modules
    ├── auth/
    ├── users/
    ├── shifts/
    ├── categories/
    ├── menu-items/
    ├── addons/
    ├── orders/
    ├── invoices/
    ├── cash-drawer/
    ├── reports/
    └── settings/
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pos-system
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update database credentials in `.env`

5. Build the project:
```bash
npm run build
```

6. Run the application:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`

API documentation: `http://localhost:3000/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with username and password/PIN
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `PATCH /api/v1/auth/me` - Update profile

### Users (Admin only)
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Shifts
- `POST /api/v1/shifts/open` - Open shift
- `POST /api/v1/shifts/close` - Close shift
- `GET /api/v1/shifts/current` - Get current shift
- `GET /api/v1/shifts` - List shifts
- `GET /api/v1/shifts/:id` - Get shift details

### Categories
- `GET /api/v1/categories` - List categories
- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories/:id` - Get category
- `PATCH /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Menu Items
- `GET /api/v1/menu-items` - List menu items
- `POST /api/v1/menu-items` - Create menu item
- `GET /api/v1/menu-items/:id` - Get menu item
- `PATCH /api/v1/menu-items/:id` - Update menu item
- `PATCH /api/v1/menu-items/:id/availability` - Toggle availability
- `DELETE /api/v1/menu-items/:id` - Delete menu item

### Add-ons
- `GET /api/v1/addons` - List add-ons
- `POST /api/v1/addons` - Create add-on
- `PATCH /api/v1/addons/:id` - Update add-on
- `DELETE /api/v1/addons/:id` - Delete add-on

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/active` - Get active orders
- `GET /api/v1/orders/:id` - Get order
- `PATCH /api/v1/orders/:id` - Update order
- `PATCH /api/v1/orders/:id/status` - Change order status
- `DELETE /api/v1/orders/:id` - Cancel order
- `POST /api/v1/orders/:id/items` - Add items to order
- `PATCH /api/v1/orders/:id/items/:itemId` - Update order item
- `DELETE /api/v1/orders/:id/items/:itemId` - Remove item
- `POST /api/v1/orders/:id/items/:itemId/void` - Void item
- `GET /api/v1/orders/:id/history` - Get order status history
- `POST /api/v1/orders/:id/duplicate` - Duplicate order
- `POST /api/v1/orders/:id/pay` - Process payment

### Invoices
- `GET /api/v1/invoices` - List invoices
- `GET /api/v1/invoices/:id` - Get invoice
- `GET /api/v1/invoices/:id/receipt` - Get receipt data
- `POST /api/v1/invoices/:id/refund` - Process refund

### Cash Drawer
- `GET /api/v1/cash-drawer` - Get current cash drawer
- `POST /api/v1/cash-drawer/cash-in` - Record cash in
- `POST /api/v1/cash-drawer/cash-out` - Record cash out

### Reports
- `GET /api/v1/reports/daily` - Get daily report
- `GET /api/v1/reports/weekly` - Get weekly report

### Settings
- `GET /api/v1/settings` - Get all settings
- `PATCH /api/v1/settings` - Update settings

## Default Credentials

After seeding, login with:
- **Username**: admin
- **Password**: admin123
- **Role**: Admin

## Error Handling

All errors follow a standard format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "field": null
  },
  "statusCode": 400,
  "timestamp": "2026-05-17T14:30:00.000Z"
}
```

## Development

### Running Tests
```bash
npm test
npm run test:cov
npm run test:e2e
```

### Building
```bash
npm run build
```

### Production
```bash
npm run start:prod
```

## Contributing

Contributions are welcome. Please follow the existing code style and add tests for new features.

## License

ISC
