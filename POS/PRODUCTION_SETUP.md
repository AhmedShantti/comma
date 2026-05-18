# POS System - Production Setup Guide

## Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 12+
- Redis 6+ (for caching)

## Backend Setup (E:\POS)

### 1. Environment Configuration
```bash
cp .env.example .env
```

**Critical Security Settings for Production:**
```env
# Database - Use strong, unique credentials
DB_PASSWORD=your-super-secret-password-here

# JWT Secrets - MUST be generated randomly (min 32 chars)
JWT_ACCESS_SECRET=generate-random-string-min-32-chars-uppercase-numbers
JWT_REFRESH_SECRET=generate-another-random-string-min-32-chars-uppercase-numbers

# CORS Origins - Only add trusted frontend URLs
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Node Environment
NODE_ENV=production
```

### 2. Generate Secure JWT Secrets
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Max 256)}))
```

### 3. Database Setup
```bash
# Create database
createdb pos_db

# Run migrations (if applicable)
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 4. Install and Build
```bash
npm install
npm run build
npm run start:prod
```

Backend will run on: `http://localhost:3000`
API Documentation: `http://localhost:3000/docs`

---

## Frontend Setup (C:\Users\pc\comma)

### 1. Environment Configuration
```bash
# Create/update .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Install and Build
```bash
npm install
npm run build
npm run start
```

Frontend will run on: `http://localhost:3001`

---

## Development Workflow

### Option 1: Backend Only (Mock Frontend API)
```bash
# Terminal 1 - Backend
cd E:/POS
npm run start:dev

# Terminal 2 - Frontend (uses api-server.js mock)
cd C:/Users/pc/comma
npm run dev:all
```

### Option 2: Real Backend + Frontend (RECOMMENDED)
```bash
# Terminal 1 - Backend
cd E:/POS
npm run start:dev

# Terminal 2 - Frontend (calls real backend)
cd C:/Users/pc/comma
npm run dev:backend
```

---

## Security Checklist

- [ ] Database credentials changed from defaults
- [ ] JWT secrets are random strings (min 32 chars)
- [ ] CORS_ORIGINS updated to only trusted domains
- [ ] NODE_ENV set to 'production'
- [ ] HTTPS configured for backend and frontend
- [ ] Redis password configured (if exposed)
- [ ] Rate limiting enabled (THROTTLE_LIMIT)
- [ ] API documentation disabled in production (`/docs` endpoint)

---

## API Endpoint Summary

All endpoints prefixed with `/api/v1`

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout  
- `GET /auth/me` - Current user profile

### Users
- `GET /users` - List all users
- `POST /users` - Create user
- `GET /users/:id` - Get user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Menu Items
- `GET /menu-items` - List all items
- `GET /menu-items/availability` - Get availability status of all items
- `GET /menu-items/:id` - Get item
- `POST /menu-items` - Create item
- `PATCH /menu-items/:id` - Update item
- `PATCH /menu-items/:id/availability` - Toggle availability
- `DELETE /menu-items/:id` - Delete item

### Orders
- `GET /orders` - List orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order
- `PATCH /orders/:id` - Update order
- `PATCH /orders/:id/status` - Change order status
- `DELETE /orders/:id` - Cancel order

### Additional Endpoints
- `GET /health` - Health check
- `GET /categories` - List categories
- `GET /shifts` - List shifts
- `GET /cash-drawer` - Get cash drawer
- `GET /reports/daily` - Daily report
- `GET /reports/weekly` - Weekly report
- `GET /settings` - Get settings
- `PATCH /settings` - Update settings
- `GET /invoices` - List invoices

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD

### JWT Verification Failed
```
Error: jwt malformed
```
- Verify JWT_ACCESS_SECRET is set correctly
- Check token is not expired

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
- Verify frontend URL is in CORS_ORIGINS
- Restart backend after changing CORS_ORIGINS

### Frontend Can't Reach Backend
```
Error: Failed to fetch
```
- Ensure backend is running on configured port
- Check NEXT_PUBLIC_API_URL in .env.local
- Check network connectivity

---

## Monitoring & Logging

All requests are logged by the `LoggingInterceptor`. Check server output for:
- Request method, path, query parameters
- Response status and timing
- Error details

Enable debug mode:
```env
NODE_ENV=development
```

---

## Performance Notes

- Caching enabled via Redis for menu items and categories
- Rate limiting: 100 requests per 60 seconds (per IP)
- Database connection pooling configured
- Pagination on list endpoints (default 20 items)

---

## Support

For issues:
1. Check error logs in terminal/console
2. Verify .env configuration
3. Check API documentation at `/api/docs`
4. Review this guide's troubleshooting section
