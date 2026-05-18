# Application Startup Guide

## ✅ Prerequisites Check

Before running the application, ensure:

- [ ] PostgreSQL installed and running
- [ ] Database `pos_db` created
- [ ] `.env` file configured with correct DB credentials
- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`npm install` completed)

---

## 🚀 Starting the Application

### Step 1: Navigate to Project Directory

```bash
cd e:\POS
```

### Step 2: Start Development Server

```bash
npm run start:dev
```

### Step 3: Expected Output

Watch for these messages in the console:

```
[Nest] 12345  - 05/17/2026, 2:30:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 05/17/2026, 2:30:00 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:01 PM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:01 PM     LOG [InstanceLoader] CacheModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] JwtModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] AuthModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] UsersModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] ShiftsModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] CategoriesModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] MenuItemsModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] AddonsModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] OrdersModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] InvoicesModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] CashDrawerModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] ReportsModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] SettingsModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [RoutesResolver] AppController {/health}: routes registered
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [Bootstrap] Application running on port 3000
```

✅ **If you see "Application running on port 3000", you're all set!**

---

## 🌐 Access the Application

### 1. **Swagger/OpenAPI Documentation**
   - Open browser: http://localhost:3000/docs
   - This shows all available API endpoints with interactive testing

### 2. **Health Check Endpoint**
   - Open browser: http://localhost:3000/api/v1/health
   - Should show:
   ```json
   {
     "status": "ok",
     "db": "connected",
     "redis": "connected",
     "uptime": 12.5
   }
   ```

### 3. **Default API Base URL**
   ```
   http://localhost:3000/api/v1
   ```

---

## 🔐 First-Time Login

### Default Credentials
- **Username**: admin
- **Password**: admin123

### Login via Swagger

1. Go to: http://localhost:3000/docs
2. Find endpoint: `POST /api/v1/auth/login`
3. Click "Try it out"
4. Enter:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
5. Click "Execute"

### Expected Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "admin",
      "email": "admin@restaurant.com",
      "full_name": "Administrator",
      "role": "admin",
      "is_active": true,
      "last_login_at": "2026-05-17T14:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 1800
    }
  },
  "statusCode": 200,
  "timestamp": "2026-05-17T14:30:00.000Z"
}
```

✅ **Copy the accessToken - you'll need it for authenticated requests**

---

## 🔒 Authorize in Swagger

To test protected endpoints in Swagger:

1. Click the **Authorize** button (lock icon) at the top
2. Paste your token:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Click "Authorize"
4. Now all requests will include your token automatically

---

## ✅ Complete First-Time Workflow

### 1. Open New Shift
```
POST /api/v1/shifts/open
Body: { "opening_cash": 1000 }
```

### 2. Create Category
```
POST /api/v1/categories
Body: {
  "name_ar": "المشروبات",
  "name_en": "Beverages",
  "sort_order": 1
}
```

### 3. Create Menu Item
```
POST /api/v1/menu-items
Body: {
  "category_id": "CATEGORY_ID_FROM_STEP_2",
  "name_ar": "قهوة",
  "name_en": "Coffee",
  "base_price": 25
}
```

### 4. Create Add-on
```
POST /api/v1/addons
Body: {
  "name_ar": "حليب إضافي",
  "name_en": "Extra Milk",
  "price": 5
}
```

### 5. Create Order
```
POST /api/v1/orders
Body: {
  "type": "dine_in",
  "table_number": "A1",
  "items": [{
    "menu_item_id": "MENU_ITEM_ID_FROM_STEP_3",
    "quantity": 2,
    "addon_ids": ["ADDON_ID_FROM_STEP_4"]
  }]
}
```

### 6. Process Payment
```
POST /api/v1/orders/{ORDER_ID}/pay
Body: {
  "payments": [{
    "method": "cash",
    "amount": 100
  }]
}
```

### 7. View Daily Report
```
GET /api/v1/reports/daily?date=2026-05-17
```

---

## 🛑 Common Startup Issues

### ❌ "Cannot connect to database"

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check PostgreSQL service is running
   - Windows: Open `services.msc` → find `postgresql-x` → should be Running
2. Verify database credentials in `.env`
3. Verify database `pos_db` exists
   - Open pgAdmin 4 or run: `psql -U postgres -c "\l"`

### ❌ "Port 3000 already in use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. Kill the process using port 3000:
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change port in `.env`:
   ```env
   PORT=3001
   ```

### ❌ "Redis connection failed"

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:**
- Redis is optional, this is just a warning
- The app will continue working without Redis
- To fix: Start Redis or ignore the warning

### ❌ "Module not found errors"

**Solution:**
```bash
npm install
npm run build
```

---

## 📊 Monitoring the Application

### Real-time Logs

While the app is running, watch the console for:

```
[Bootstrap] Application running on port 3000
[RoutesResolver] AuthController {/auth}: routes registered
[InstanceLoader] UsersModule dependencies initialized
```

### Database Activity

Open pgAdmin 4 and watch the tables populate as you make API requests.

---

## 🎯 Next Steps

1. **Test All Endpoints**: Use Swagger UI at http://localhost:3000/docs
2. **Create Test Data**: Follow the workflow above
3. **Review Database**: Open pgAdmin 4 to see tables and data
4. **Read API Docs**: Check README.md for detailed endpoint documentation

---

## 🆘 Getting Help

### Check Logs
The console shows detailed error messages. Look for:
- Database connection errors
- Authentication failures
- Validation errors
- Business logic errors

### Common Endpoints
- **Health**: GET http://localhost:3000/api/v1/health
- **Docs**: GET http://localhost:3000/docs
- **Login**: POST http://localhost:3000/api/v1/auth/login

### File Locations
- Logs: Console output
- Configuration: `.env` file
- Source Code: `src/` directory
- Compiled Code: `dist/` directory

---

## ⚠️ Development Tips

### Auto-Reload
- Changes to source files automatically reload (hot-reload)
- No need to restart the server

### Database Schema Changes
- TypeORM auto-synchronizes schema in development
- Just restart the app after entity changes

### Debugging
- Use browser DevTools for frontend (if connected)
- Check console logs for backend issues
- Use Visual Studio Code debugger for advanced debugging

---

## ✅ You're Ready!

The application is now running and ready for testing. Start with the Swagger UI at:

```
http://localhost:3000/docs
```

**Happy testing!** 🎉
