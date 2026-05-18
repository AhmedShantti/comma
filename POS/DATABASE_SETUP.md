# PostgreSQL Setup Guide for POS System

## ✅ Prerequisites Checklist

- [ ] PostgreSQL installed on Windows
- [ ] PostgreSQL service running
- [ ] pgAdmin 4 installed (optional, for GUI management)
- [ ] Know your PostgreSQL password

---

## Step 1: Install PostgreSQL (If Not Already Installed)

### Windows Installation Steps:

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Download version 15 or 16 (latest)

2. **Run Installer** 
   - Execute the downloaded `.exe` file
   - Click through the installation wizard

3. **Configuration During Install**
   ```
   Installation Directory: C:\Program Files\PostgreSQL\15
   Port: 5432 (default)
   Superuser Password: [Create a strong password - REMEMBER THIS!]
   Database Locale: [Your locale]
   ```

4. **Verify Installation**
   - Open Command Prompt or PowerShell
   - Run: `psql --version`
   - Should show: `psql (PostgreSQL) X.X`

5. **Verify Service Running**
   - Press `Win + R`
   - Type: `services.msc`
   - Look for "postgresql-x" service
   - Status should be "Running" (if not, right-click → Start)

---

## Step 2: Create Database Using pgAdmin 4

pgAdmin 4 is a GUI tool that comes with PostgreSQL. It's the easiest way to create your database.

### Using pgAdmin 4:

1. **Open pgAdmin 4**
   - It should have opened automatically after PostgreSQL installation
   - Or go to: http://localhost:5050
   - Default login: email used during install

2. **Create Database**
   - In left sidebar, right-click on "Databases"
   - Select "Create → Database"
   - **Name**: `pos_db`
   - Click "Save"

3. **Verify Database**
   - Expand "Databases" 
   - You should see `pos_db` in the list

✅ **Database Created!**

---

## Step 3: Alternative - Create Database Using Command Line

If you prefer command line (psql):

1. **Open Command Prompt/PowerShell as Administrator**

2. **Connect to PostgreSQL**
   ```bash
   psql -U postgres -h localhost
   ```
   - When prompted for password, enter the password you created during installation

3. **Create Database**
   ```sql
   CREATE DATABASE pos_db;
   ```

4. **Verify Creation**
   ```sql
   \l
   ```
   - You should see `pos_db` in the list

5. **Exit psql**
   ```sql
   \q
   ```

✅ **Database Created!**

---

## Step 4: Configure .env File

Update your `.env` file with PostgreSQL credentials:

### Default Configuration (if you used default installation):

```env
# App Configuration
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres          # ← Update this with YOUR PostgreSQL password
DB_DATABASE=pos_db

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets
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

### If You Used a Different Password:
Replace `postgres` in `DB_PASSWORD=postgres` with your actual password.

### If You Used a Different Username:
Replace `postgres` in `DB_USERNAME=postgres` with your actual username.

---

## Step 5: Test Database Connection

Before running the application, verify the connection works:

1. **Open Command Prompt/PowerShell**

2. **Test Connection**
   ```bash
   psql -h localhost -U postgres -d pos_db
   ```

3. **Expected Result**
   ```
   pos_db=#
   ```
   - This confirms you're connected to the database

4. **Exit**
   ```sql
   \q
   ```

✅ **Connection Verified!**

---

## Step 6: Run Database Migrations

The NestJS application uses TypeORM to manage database schema. 

### Enable Auto-Synchronization (Development Only):

For development, the `.env` and TypeORM config already handle schema creation automatically.

1. **Verify config in `src/config/database.config.ts`:**
   ```typescript
   synchronize: process.env.NODE_ENV === 'development' // Auto-sync in dev
   ```

2. **When you run the app, TypeORM will:**
   - Automatically create all tables
   - Create all indexes
   - Set up relationships
   - No manual migration commands needed

### Manual Migration (Optional for Production):

If you want to create migrations manually:

```bash
cd e:\POS

# Create a migration
npm run typeorm migration:create src/database/migrations/InitialSchema

# Run migrations
npm run typeorm migration:run

# Revert migrations
npm run typeorm migration:revert
```

---

## Step 7: Verify Tables Creation

After starting the application, verify tables were created:

1. **Open pgAdmin 4** (http://localhost:5050)

2. **Navigate to**:
   - Servers → PostgreSQL → Databases → pos_db → Schemas → public → Tables

3. **You should see tables like**:
   - `users`
   - `shifts`
   - `categories`
   - `menu_items`
   - `addons`
   - `orders`
   - `order_items`
   - `invoices`
   - `payments`
   - etc.

✅ **Tables Created Automatically!**

---

## Step 8: Seed Default Data (Optional)

To create default admin user and test data, you can create a seed file:

1. Create `src/database/seeds/seed.ts`:

```typescript
import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

const seedDatabase = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  
  // Check if admin exists
  const adminExists = await userRepository.findOne({ 
    where: { username: 'admin' } 
  });
  
  if (!adminExists) {
    const adminUser = new User();
    adminUser.username = 'admin';
    adminUser.email = 'admin@restaurant.com';
    adminUser.password = await bcrypt.hash('admin123', 12);
    adminUser.full_name = 'Administrator';
    adminUser.role = 'admin';
    adminUser.is_active = true;
    
    await userRepository.save(adminUser);
    console.log('✅ Default admin user created');
  } else {
    console.log('✅ Admin user already exists');
  }
};

export default seedDatabase;
```

---

## Troubleshooting

### ❌ "psql: command not found"
**Solution**: PostgreSQL bin directory not in PATH
- Add `C:\Program Files\PostgreSQL\15\bin` to Windows PATH
- Restart Command Prompt
- Try again

### ❌ "FATAL: password authentication failed"
**Solution**: Wrong password
- Use correct password from installation
- Or reset password in pgAdmin 4

### ❌ "Connection refused"
**Solution**: PostgreSQL service not running
- Open `services.msc`
- Find `postgresql-x`
- Right-click → Start

### ❌ "Database already exists"
**Solution**: Database already created
- Either drop it: `DROP DATABASE pos_db;`
- Or use existing database

### ❌ "Port 5432 already in use"
**Solution**: Another PostgreSQL instance running
- Check for multiple PostgreSQL services
- Or use different port: Change `DB_PORT` in `.env`

---

## ✅ Complete Checklist

- [ ] PostgreSQL installed and service running
- [ ] Database `pos_db` created
- [ ] `.env` file configured with correct credentials
- [ ] Database connection tested successfully
- [ ] Ready to run `npm run start:dev`

---

## Next: Run the Application

Once everything above is complete, proceed to:

```bash
cd e:\POS
npm run start:dev
```

See **APPLICATION_STARTUP.md** for what to expect.
