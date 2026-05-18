# Quick Start Guide

## Step 1: Verify PostgreSQL is Running

```bash
psql -U postgres -h localhost -c "SELECT version();"
```

## Step 2: Verify Database Exists

```bash
psql -U postgres -l | grep pos_db
```

If not created yet:
```bash
createdb -U postgres pos_db
```

## Step 3: Check .env Configuration

**File**: `E:/POS/.env`

Verify these settings match your actual PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres        # <- Update if different
DB_DATABASE=pos_db
```

## Step 4: Start Backend

```bash
cd E:\POS
npm install
npm run start:dev
```

**Wait for**: `Application running on port 3000`

✅ **Success**: Backend API is ready at http://localhost:3000

## Step 5: Start Frontend

```bash
cd C:\Users\pc\comma
npm install
npm run dev:backend
```

**Frontend**: http://localhost:3001

---

## Login with Your Existing Users

Use the credentials from your existing user account in the database.

## Access API Documentation

http://localhost:3000/docs

---

## Troubleshooting

### "password authentication failed"
Your PostgreSQL password is not `postgres`. Update `.env`:
```env
DB_PASSWORD=your_actual_postgres_password
```

### "Database does not exist"
```bash
createdb -U postgres pos_db
```

### "Cannot find module"
```bash
npm install
```

### Port 3000/3001 in use
Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

See AUDIT_REPORT.md for complete documentation!
