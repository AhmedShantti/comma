# Complete Installation & Setup Checklist

## 📋 Phase 1: PostgreSQL Installation

### For Windows Users

#### Option A: Using PostgreSQL Installer (Recommended)

- [ ] Go to https://www.postgresql.org/download/windows/
- [ ] Download PostgreSQL 15 or 16
- [ ] Run the installer
- [ ] During installation:
  - [ ] Accept default installation directory
  - [ ] Select to install "PostgreSQL Server", "pgAdmin 4", and "Command Line Tools"
  - [ ] Create a superuser password (WRITE IT DOWN: __________)
  - [ ] Use port 5432
  - [ ] Continue with defaults

- [ ] **After Installation:**
  - [ ] Open Command Prompt or PowerShell
  - [ ] Run: `psql --version`
  - [ ] Should show: `psql (PostgreSQL) X.X`
  - [ ] If not found, add PostgreSQL to PATH:
    - Windows Key → "Environment Variables"
    - Edit PATH
    - Add: `C:\Program Files\PostgreSQL\15\bin`
    - Restart Command Prompt
    - Try `psql --version` again

#### Option B: Using Docker (Alternative)

- [ ] Install Docker for Windows
- [ ] Run in PowerShell:
  ```powershell
  docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
  ```

---

## 📋 Phase 2: Create Database

### Using pgAdmin 4 (GUI - Easier)

- [ ] Open pgAdmin 4 (http://localhost:5050)
- [ ] Login with email you used during PostgreSQL installation
- [ ] Right-click "Databases" in left sidebar
- [ ] Click "Create" → "Database"
- [ ] Name: `pos_db`
- [ ] Click "Save"
- [ ] Verify `pos_db` appears in the Databases list

### Using Command Line (If Preferred)

- [ ] Open Command Prompt or PowerShell as Administrator
- [ ] Run: `psql -U postgres -h localhost`
- [ ] When prompted, enter your PostgreSQL password
- [ ] Run: `CREATE DATABASE pos_db;`
- [ ] Verify: `\l`
- [ ] Exit: `\q`

### Testing Connection

- [ ] Run: `psql -U postgres -h localhost -d pos_db`
- [ ] Should show: `pos_db=#`
- [ ] Exit: `\q`

---

## 📋 Phase 3: Configure .env File

The `.env` file is already created at `e:\POS\.env`

- [ ] Open `e:\POS\.env` in a text editor
- [ ] Verify/Update these settings:

```env
# Database Configuration
DB_HOST=localhost                    # Usually localhost
DB_PORT=5432                         # PostgreSQL default
DB_USERNAME=postgres                 # Your PostgreSQL username
DB_PASSWORD=postgres                 # YOUR PASSWORD - Change this!
DB_DATABASE=pos_db                   # Database we just created
```

**Important**: If you set a different password during PostgreSQL installation, update `DB_PASSWORD` above.

- [ ] Save the `.env` file

---

## 📋 Phase 4: Prepare Application

- [ ] Navigate to project directory:
  ```bash
  cd e:\POS
  ```

- [ ] Verify dependencies installed:
  ```bash
  npm install
  ```

- [ ] Build the project:
  ```bash
  npm run build
  ```
  
  Should complete without errors (the dist folder should be created)

---

## 📋 Phase 5: Run Application

### Start Development Server

- [ ] In Command Prompt/PowerShell, run:
  ```bash
  cd e:\POS
  npm run start:dev
  ```

- [ ] Watch for the success message:
  ```
  [Bootstrap] Application running on port 3000
  ```

- [ ] ✅ Application is now running!

### First-Time Database Setup

When you start the app:
- [ ] TypeORM will automatically:
  - [ ] Create all database tables
  - [ ] Create all indexes
  - [ ] Set up relationships

You can verify in pgAdmin 4:
- [ ] Open pgAdmin 4
- [ ] Navigate to: Servers → PostgreSQL → pos_db → Schemas → public → Tables
- [ ] You should see tables like: users, orders, shifts, invoices, etc.

---

## 📋 Phase 6: Verify Everything Works

### Test Health Endpoint

- [ ] Open browser: http://localhost:3000/api/v1/health
- [ ] Should show:
  ```json
  {
    "status": "ok",
    "db": "connected",
    "redis": "connected"
  }
  ```

### Access API Documentation

- [ ] Open browser: http://localhost:3000/docs
- [ ] Should see Swagger UI with all endpoints listed

### Test Login

- [ ] In Swagger UI, find: `POST /api/v1/auth/login`
- [ ] Click "Try it out"
- [ ] Enter:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- [ ] Click "Execute"
- [ ] Should receive response with tokens

---

## ✅ Completion Checklist

### PostgreSQL & Database
- [ ] PostgreSQL installed
- [ ] `psql --version` works
- [ ] Database `pos_db` created
- [ ] Connection test successful

### Project Configuration
- [ ] `.env` file configured with correct credentials
- [ ] `npm install` completed
- [ ] `npm run build` successful

### Application Running
- [ ] `npm run start:dev` running without errors
- [ ] Application running on port 3000
- [ ] Health endpoint responds
- [ ] Database tables created
- [ ] Swagger UI accessible at /docs
- [ ] Login endpoint works

---

## 🆘 Troubleshooting Quick Links

### Issue: "psql command not found"
See: DATABASE_SETUP.md → Troubleshooting → "psql: command not found"

### Issue: "Connection refused"
See: DATABASE_SETUP.md → Troubleshooting → "Connection refused"

### Issue: "Password authentication failed"
See: DATABASE_SETUP.md → Troubleshooting → "FATAL: password authentication failed"

### Issue: "Port 3000 already in use"
See: APPLICATION_STARTUP.md → Common Startup Issues

---

## 📚 Documentation Files

- **DATABASE_SETUP.md** - Detailed PostgreSQL setup guide
- **APPLICATION_STARTUP.md** - Starting the app and first steps
- **README.md** - Full API documentation
- **QUICK_START.md** - Fast setup guide

---

## 🎯 Next Steps (After Setup Complete)

1. **Explore API**
   - Visit http://localhost:3000/docs
   - Try different endpoints in Swagger UI

2. **Create Test Data**
   - Create categories
   - Create menu items
   - Create orders
   - Follow the workflow in APPLICATION_STARTUP.md

3. **Monitor Database**
   - Open pgAdmin 4
   - Watch tables populate with data

4. **Review Source Code**
   - Read src/modules/* for implementation details
   - Check src/config/* for configuration

5. **Read API Documentation**
   - See README.md for endpoint details
   - Understand error codes and responses

---

## ⏱️ Estimated Time

- PostgreSQL Installation: 5-10 minutes
- Database Creation: 2 minutes
- Configuration: 2 minutes
- Build & Start: 3-5 minutes
- **Total: ~15-25 minutes**

---

## ✨ You're All Set!

Once you've completed all checkboxes above, your POS system is:
- ✅ Installed
- ✅ Configured
- ✅ Connected to database
- ✅ Running and ready for testing

**Welcome to your Restaurant POS System!** 🎉
