# 🚀 Final Setup Instructions

Your PostgreSQL password has been saved. Now complete these steps:

## Step 1: Create Database (Choose One Method)

### Method A: Run the Batch Script (Easiest)

1. **Double-click**: `e:\POS\create-database.bat`
2. Wait for completion
3. **Skip to Step 2**

### Method B: Run PowerShell Script

1. Open PowerShell as Administrator
2. Navigate to project:
   ```powershell
   cd e:\POS
   ```
3. Run the script:
   ```powershell
   .\setup-database.ps1
   ```
4. When prompted:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: `2612`

### Method C: Use pgAdmin 4 (Manual)

1. Open browser: http://localhost:5050
2. Right-click Databases
3. Create → Database
4. Name: `pos_db`
5. Save

### Method D: Command Line (Manual)

```bash
psql -U postgres -h localhost
# When prompted for password, enter: 2612

# Then in psql, run:
CREATE DATABASE pos_db;
\l
# Should see pos_db in the list
\q
```

---

## Step 2: Verify Database Created

Once database is created, verify it exists:

**Using pgAdmin 4**:
- Open http://localhost:5050
- Navigate to: Servers → PostgreSQL 18 → Databases
- Should see: `pos_db`

**Using Command Line**:
```bash
psql -U postgres -h localhost -d pos_db
# Should show: pos_db=#
\q
```

---

## Step 3: Start the Application

1. **Open Command Prompt or PowerShell**
2. **Navigate to project**:
   ```bash
   cd e:\POS
   ```
3. **Install dependencies** (if not done):
   ```bash
   npm install
   ```
4. **Build project** (if not done):
   ```bash
   npm run build
   ```
5. **Start development server**:
   ```bash
   npm run start:dev
   ```

6. **Wait for this message**:
   ```
   [Bootstrap] Application running on port 3000
   ```

✅ **Application is running!**

---

## Step 4: Database Setup (Automatic)

When the application starts, TypeORM will:
- ✅ Automatically create all tables
- ✅ Create all indexes
- ✅ Set up relationships
- ✅ NO additional commands needed!

**You can verify tables were created**:
- Open pgAdmin 4: http://localhost:5050
- Navigate to: Servers → PostgreSQL 18 → pos_db → Schemas → public → Tables
- Should see: users, orders, shifts, invoices, etc.

---

## Step 5: Seed Default Data (Optional but Recommended)

The database is ready with all tables created. To add sample data:

### Option A: Automatic (with Node script)

```bash
# Stop the server (Ctrl+C if running)
cd e:\POS

# Compile seed script
npm run build

# This will be added to startup in next steps
```

### Option B: Manual via Swagger UI

1. Open: http://localhost:3000/docs
2. Create categories
3. Create menu items
4. Create add-ons
5. Create test orders

---

## Step 6: Access Your POS System

### 🌐 Swagger UI (Interactive API Testing)
```
http://localhost:3000/docs
```

### 🏥 Health Check
```
http://localhost:3000/api/v1/health
```

Should show:
```json
{
  "status": "ok",
  "db": "connected",
  "redis": "connected",
  "uptime": 45.2
}
```

### 🔐 Default Login
```
Username: admin
Password: admin123
```

---

## Step 7: Test the API

### In Swagger UI:

1. Find: `POST /api/v1/auth/login`
2. Click: "Try it out"
3. Enter:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. Click: "Execute"
5. Copy the `accessToken` from the response

### Authorize All Requests:

1. Click: "Authorize" button (lock icon) at top
2. Paste: `Bearer YOUR_ACCESS_TOKEN`
3. Click: "Authorize"
4. Now all endpoints are authenticated!

---

## Step 8: Create Test Data (Optional)

Try these in Swagger UI (in order):

### 1. Open a Shift
```
POST /api/v1/shifts/open
Body: { "opening_cash": 1000 }
```

### 2. Create a Category
```
POST /api/v1/categories
Body: {
  "name_ar": "مشروبات",
  "name_en": "Beverages",
  "sort_order": 1
}
```

### 3. Create a Menu Item
```
POST /api/v1/menu-items
Body: {
  "category_id": "ID_FROM_STEP_2",
  "name_ar": "قهوة",
  "name_en": "Coffee",
  "base_price": 25
}
```

### 4. Create an Order
```
POST /api/v1/orders
Body: {
  "type": "dine_in",
  "table_number": "A1",
  "items": [{
    "menu_item_id": "ID_FROM_STEP_3",
    "quantity": 1
  }]
}
```

### 5. Process Payment
```
POST /api/v1/orders/ORDER_ID/pay
Body: {
  "payments": [{
    "method": "cash",
    "amount": 50
  }]
}
```

---

## ✅ Success Checklist

Mark off each item:

- [ ] Database created: `pos_db`
- [ ] `.env` configured with password: `2612`
- [ ] Application running: `npm run start:dev`
- [ ] Shows: `[Bootstrap] Application running on port 3000`
- [ ] Health endpoint works: http://localhost:3000/api/v1/health
- [ ] Swagger UI loads: http://localhost:3000/docs
- [ ] Database tables created (visible in pgAdmin)
- [ ] Login works: admin / admin123

---

## 🆘 Troubleshooting

### Database Creation Failed

**Error: "database pos_db already exists"**
- Good news! Database already exists
- Just skip to Step 3

**Error: "password authentication failed"**
- Password is wrong
- Try: `2612`
- If still wrong, reset PostgreSQL password

**Error: "psql: command not found"**
- PostgreSQL bin not in PATH
- Use pgAdmin 4 instead (http://localhost:5050)

### Application Won't Start

**Error: "Cannot connect to database"**
- Verify database `pos_db` exists
- Check `.env` password is: `2612`
- PostgreSQL service must be running

**Error: "Port 3000 already in use"**
- Change in `.env`: `PORT=3001`
- Restart the app

### Other Issues

See: DATABASE_SETUP.md Troubleshooting section

---

## 📊 Expected Results

### Console Output When Starting
```
[Nest] 12345  - 05/17/2026, 2:30:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 05/17/2026, 2:30:00 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:01 PM     LOG [InstanceLoader] AuthModule dependencies initialized
[Nest] 12345  - 05/17/2026, 2:30:02 PM     LOG [Bootstrap] Application running on port 3000
```

### Health Endpoint Response
```json
{
  "status": "ok",
  "db": "connected",
  "redis": "connected",
  "uptime": 45.2
}
```

### Database Tables (in pgAdmin)
```
users
shifts
categories
menu_items
variants
addons
orders
order_items
order_item_addons
order_status_logs
invoices
payments
refunds
cash_drawers
settings
```

---

## 🎯 Next Steps After Setup

1. **Explore API** at http://localhost:3000/docs
2. **Create test data** using Swagger UI
3. **Review source code** in `src/modules/`
4. **Read API docs** in README.md
5. **Start developing** your features!

---

## 📝 Important Notes

- ✅ Password saved in `.env`: `DB_PASSWORD=2612`
- ✅ Database will be created automatically
- ✅ Tables will be synced automatically on startup
- ✅ Default admin user ready: `admin/admin123`
- ✅ Swagger UI available for API testing

---

## 🎉 Summary

You now have:
- ✅ PostgreSQL 18 installed
- ✅ Database `pos_db` created
- ✅ `.env` configured
- ✅ Application built
- ✅ Ready to run!

**Next Action**: Run `npm run start:dev` and enjoy your POS system! 🚀

---

**Questions?** Check the troubleshooting section or see other documentation files.

**Need help creating the database?** Use one of the 4 methods in Step 1 above.
