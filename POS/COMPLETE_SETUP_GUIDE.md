# 🚀 Complete POS System Setup Guide

## Overview

This guide will walk you through setting up the Restaurant & Café POS System from scratch. The process includes:

1. **PostgreSQL Installation** (if needed)
2. **Database Creation**
3. **Environment Configuration**
4. **Application Startup**
5. **Verification & Testing**

**Estimated Time: 20-30 minutes**

---

## 📋 Quick Navigation

- **For Windows**: Follow the "Windows Installation" section below
- **Already have PostgreSQL**: Jump to "Database Setup"
- **Troubleshooting**: See the Troubleshooting section at the end

---

## Part 1: PostgreSQL Installation

### Check if PostgreSQL is Already Installed

Open Command Prompt or PowerShell and run:

```bash
psql --version
```

If it shows a version number (e.g., "psql (PostgreSQL) 15.2"), **skip to Part 2**.

If it says "command not found", follow the installation steps below.

### Windows Installation Steps

#### Step 1A: Download PostgreSQL

1. Visit: **https://www.postgresql.org/download/windows/**
2. Click **"Download the installer"**
3. Download the latest version (PostgreSQL 15 or 16)

#### Step 1B: Run the Installer

1. **Double-click** the downloaded `.exe` file
2. Click **"Next"** through the setup wizard
3. **Keep all default settings**, EXCEPT:

   | Setting | Value |
   |---------|-------|
   | Installation Directory | `C:\Program Files\PostgreSQL\15` (default) |
   | Components | ✓ PostgreSQL Server, ✓ pgAdmin 4, ✓ Command Line Tools |
   | Password | **Create a strong password** |
   | Port | `5432` (default) |

4. **IMPORTANT**: Write down your password!
   ```
   My PostgreSQL Password: ___________________
   ```

5. Click **"Finish"** to complete installation

#### Step 1C: Verify Installation

1. Open **Command Prompt** or **PowerShell**
2. Run:
   ```bash
   psql --version
   ```
3. Should show: `psql (PostgreSQL) 15.2` (or similar)

✅ **PostgreSQL Installed Successfully!**

---

## Part 2: Database Setup

### Option A: Using the Automated Setup Script (Easiest)

If PostgreSQL is installed and working:

1. **Open PowerShell as Administrator**
2. Navigate to the POS directory:
   ```powershell
   cd e:\POS
   ```
3. Run the setup script:
   ```powershell
   .\setup-database.ps1
   ```
4. Follow the prompts:
   - Enter PostgreSQL host: `localhost` (press Enter for default)
   - Enter port: `5432` (press Enter for default)
   - Enter username: `postgres` (press Enter for default)
   - Enter your PostgreSQL password (the one you created during installation)

The script will:
- ✅ Verify PostgreSQL is installed
- ✅ Test the connection
- ✅ Create the `pos_db` database
- ✅ Update the `.env` file with credentials

**Skip to Part 3** if the script completes successfully.

### Option B: Manual Database Creation (Using pgAdmin 4)

pgAdmin 4 is a GUI tool that came with your PostgreSQL installation.

#### Step 2B-1: Open pgAdmin 4

1. Open web browser
2. Go to: **http://localhost:5050**
3. Login with the email you used during PostgreSQL installation
   - If you don't remember, try: `postgres@localhost`

#### Step 2B-2: Create Database

1. In the **left sidebar**, expand **"Servers"**
2. Expand **"PostgreSQL XX"** (where XX is the version)
3. **Right-click** on **"Databases"**
4. Select **"Create"** → **"Database"**
5. In the dialog:
   - **Database name**: `pos_db`
   - Leave all other fields as default
6. Click **"Save"**

✅ **Database Created!**

#### Step 2B-3: Verify Creation

You should see `pos_db` appear in the **Databases** list on the left sidebar.

### Option C: Manual Database Creation (Command Line)

1. **Open Command Prompt or PowerShell**
2. Connect to PostgreSQL:
   ```bash
   psql -U postgres -h localhost
   ```
3. When prompted for password, enter your PostgreSQL password
4. Create the database:
   ```sql
   CREATE DATABASE pos_db;
   ```
5. Verify:
   ```sql
   \l
   ```
   You should see `pos_db` in the list.
6. Exit:
   ```sql
   \q
   ```

✅ **Database Created!**

---

## Part 3: Configure Environment Variables

### Update the `.env` File

The `.env` file controls the application's configuration.

1. **Open** `e:\POS\.env` in a text editor (Notepad, VS Code, etc.)

2. **Find these lines**:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=pos_db
   ```

3. **Update them** (only update if different from your setup):

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `DB_HOST` | `localhost` | Usually stays the same |
   | `DB_PORT` | `5432` | PostgreSQL default port |
   | `DB_USERNAME` | `postgres` | Default PostgreSQL user |
   | `DB_PASSWORD` | **YOUR PASSWORD** | Change to your PostgreSQL password |
   | `DB_DATABASE` | `pos_db` | Database we just created |

4. **Save the file** (Ctrl+S)

### Example Configured `.env`

If your PostgreSQL password is `MyPassword123`:

```env
# App
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=MyPassword123
DB_DATABASE=pos_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_ACCESS_EXPIRATION=30m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,http://localhost:5173

# Throttle
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

✅ **Configuration Complete!**

---

## Part 4: Start the Application

### Step 4-1: Open Terminal

1. **Open Command Prompt or PowerShell**
2. Navigate to the project:
   ```bash
   cd e:\POS
   ```

### Step 4-2: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 4-3: Build the Project

```bash
npm run build
```

### Step 4-4: Start Development Server

```bash
npm run start:dev
```

### Step 4-5: Wait for Startup Message

Watch the console for this message:

```
[Bootstrap] Application running on port 3000
```

**When you see this, the application is running!** ✅

---

## Part 5: Verify Everything Works

### Check 1: Health Endpoint

1. Open web browser
2. Go to: **http://localhost:3000/api/v1/health**
3. Should show:
   ```json
   {
     "status": "ok",
     "db": "connected",
     "redis": "connected",
     "uptime": 45.2
   }
   ```

✅ **Database connection working!**

### Check 2: API Documentation

1. Open web browser
2. Go to: **http://localhost:3000/docs**
3. Should see Swagger UI with all API endpoints listed

✅ **API ready!**

### Check 3: Test Login

1. In Swagger UI, find: `POST /api/v1/auth/login`
2. Click **"Try it out"**
3. Copy this into the request body:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. Click **"Execute"**
5. Should see a response with `accessToken`

✅ **Authentication working!**

### Check 4: Database Tables

To verify tables were created:

1. Open **pgAdmin 4** (http://localhost:5050)
2. Navigate to:
   ```
   Servers → PostgreSQL XX → Databases → pos_db → 
   Schemas → public → Tables
   ```
3. You should see tables like:
   - `users`
   - `orders`
   - `shifts`
   - `invoices`
   - etc.

✅ **All tables created!**

---

## Part 6: First-Time Usage

### Default Login Credentials

Use these to test the system:

```
Username: admin
Password: admin123
```

### Test the Complete Workflow

#### 1. Open a Shift
```
POST /api/v1/shifts/open
Body: { "opening_cash": 1000 }
```

#### 2. Create a Category
```
POST /api/v1/categories
Body: {
  "name_ar": "مشروبات",
  "name_en": "Beverages",
  "sort_order": 1
}
```

#### 3. Create a Menu Item
```
POST /api/v1/menu-items
Body: {
  "category_id": "[ID from step 2]",
  "name_ar": "قهوة",
  "name_en": "Coffee",
  "base_price": 25
}
```

#### 4. Create an Order
```
POST /api/v1/orders
Body: {
  "type": "dine_in",
  "table_number": "A1",
  "items": [{
    "menu_item_id": "[ID from step 3]",
    "quantity": 1
  }]
}
```

#### 5. Process Payment
```
POST /api/v1/orders/[ORDER_ID]/pay
Body: {
  "payments": [{
    "method": "cash",
    "amount": 50
  }]
}
```

✅ **Complete workflow tested!**

---

## 🆘 Troubleshooting

### ❌ "psql command not found"

**Problem**: PostgreSQL not in system PATH

**Solution**:
1. Windows Key → Type "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "System variables", find "Path"
5. Click "Edit" → "New"
6. Add: `C:\Program Files\PostgreSQL\15\bin`
7. Click OK → OK → OK
8. Restart Command Prompt
9. Try `psql --version` again

### ❌ "Connection refused - port 5432"

**Problem**: PostgreSQL service not running

**Solution**:
1. Windows Key → Type "Services"
2. Find "postgresql-15" (or your version)
3. Right-click → "Start"
4. Try connecting again

### ❌ "FATAL: password authentication failed"

**Problem**: Wrong password in `.env`

**Solution**:
1. Verify your PostgreSQL password
2. Update `.env` with correct password
3. Save `.env`
4. Restart the application: `npm run start:dev`

### ❌ "Port 3000 already in use"

**Problem**: Another application using port 3000

**Solution Option 1**: Kill the process
```powershell
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

**Solution Option 2**: Use different port
1. Edit `.env`
2. Change: `PORT=3001`
3. Restart app

### ❌ "Cannot find module" errors

**Problem**: Dependencies not installed

**Solution**:
```bash
npm install
npm run build
npm run start:dev
```

### ❌ "Column "..." does not exist"

**Problem**: Database schema not synchronized

**Solution**:
1. Stop the application (Ctrl+C)
2. Delete the database:
   ```bash
   psql -U postgres -h localhost -c "DROP DATABASE pos_db;"
   ```
3. Create it again (see Part 2)
4. Start app: `npm run start:dev`

---

## 📚 Additional Resources

- **DATABASE_SETUP.md** - Detailed database configuration
- **APPLICATION_STARTUP.md** - App startup guide
- **INSTALLATION_CHECKLIST.md** - Step-by-step checklist
- **README.md** - API documentation
- **QUICK_START.md** - 5-minute quick start

---

## ✅ Success Checklist

Verify all of these are complete:

- [ ] PostgreSQL installed (`psql --version` works)
- [ ] Database `pos_db` created
- [ ] `.env` file configured with correct password
- [ ] `npm install` completed
- [ ] `npm run build` successful
- [ ] Application started: `npm run start:dev`
- [ ] Health endpoint works: http://localhost:3000/api/v1/health
- [ ] Swagger docs available: http://localhost:3000/docs
- [ ] Login works with admin/admin123
- [ ] Database tables visible in pgAdmin 4

---

## 🎉 You're All Set!

Your POS system is now:
- ✅ Installed
- ✅ Configured
- ✅ Connected to Database
- ✅ Running and Ready

### Next Steps

1. **Explore the API** at http://localhost:3000/docs
2. **Create test data** using the workflow in Part 6
3. **Read the documentation** in README.md
4. **Start building** your POS features

---

## 📞 Quick Help

### Application Won't Start?
- Check PostgreSQL is running (Services → postgresql-15)
- Verify `.env` credentials are correct
- Check no other app using port 3000

### Can't Connect to Database?
- Verify PostgreSQL service is running
- Test with pgAdmin 4
- Check `.env` has correct credentials

### Swagger UI Not Loading?
- Ensure app is running: `npm run start:dev`
- Try refreshing: http://localhost:3000/docs
- Check browser console for errors

### Still Having Issues?
- See the **Troubleshooting** section above
- Check the relevant documentation file
- Restart everything and try again

---

**Happy coding!** 🚀

Your Restaurant POS System is ready to go!
