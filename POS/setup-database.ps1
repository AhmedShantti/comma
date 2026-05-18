# PostgreSQL POS System Database Setup Script
# This script automates database creation and configuration
# Run this AFTER PostgreSQL is installed

# Color output functions
function Write-Success {
    Write-Host $args[0] -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host $args[0] -ForegroundColor Red
}

function Write-Warning-Custom {
    Write-Host $args[0] -ForegroundColor Yellow
}

function Write-Info {
    Write-Host $args[0] -ForegroundColor Cyan
}

# Clear screen
Clear-Host

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  POS System Database Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Info "Step 1: Checking PostgreSQL Installation..."

try {
    $psqlVersion = & psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ PostgreSQL found: $psqlVersion"
    } else {
        Write-Error-Custom "✗ PostgreSQL not found in PATH"
        Write-Warning-Custom "Please install PostgreSQL first:"
        Write-Host "  https://www.postgresql.org/download/windows/"
        exit 1
    }
}
catch {
    Write-Error-Custom "✗ Error checking PostgreSQL: $_"
    Write-Warning-Custom "Make sure PostgreSQL is installed and in PATH"
    exit 1
}

Write-Host ""

# Get PostgreSQL credentials
Write-Info "Step 2: PostgreSQL Credentials..."
Write-Host "These should match your PostgreSQL installation settings"
Write-Host ""

$dbHost = Read-Host "Database Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "Database Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }

$dbUsername = Read-Host "Database Username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUsername)) { $dbUsername = "postgres" }

Write-Warning-Custom "Enter your PostgreSQL superuser password:"
$dbPassword = Read-Host -AsSecureString "Password"
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($dbPassword))

Write-Host ""

# Set environment variable for password
$env:PGPASSWORD = $plainPassword

# Test connection
Write-Info "Step 3: Testing PostgreSQL Connection..."

try {
    & psql -h $dbHost -U $dbUsername -p $dbPort -c "SELECT version();" 2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Connection successful!"
    } else {
        Write-Error-Custom "✗ Connection failed"
        Write-Error-Custom "Please verify your credentials and try again"
        exit 1
    }
}
catch {
    Write-Error-Custom "✗ Connection error: $_"
    exit 1
}

Write-Host ""

# Create database
Write-Info "Step 4: Creating Database 'pos_db'..."

try {
    # Check if database exists
    $checkDb = & psql -h $dbHost -U $dbUsername -p $dbPort -c "SELECT 1 FROM pg_database WHERE datname = 'pos_db';" 2>&1

    if ($checkDb -match "1") {
        Write-Warning-Custom "! Database 'pos_db' already exists"

        $recreate = Read-Host "Do you want to drop and recreate it? (y/n)"
        if ($recreate -eq "y") {
            Write-Info "Dropping existing database..."
            & psql -h $dbHost -U $dbUsername -p $dbPort -c "DROP DATABASE IF EXISTS pos_db;" | Out-Null

            if ($LASTEXITCODE -eq 0) {
                Write-Success "✓ Database dropped"
            } else {
                Write-Error-Custom "✗ Failed to drop database"
                exit 1
            }
        } else {
            Write-Info "Using existing database"
        }
    }

    # Create database if it doesn't exist or was dropped
    $checkDb = & psql -h $dbHost -U $dbUsername -p $dbPort -c "SELECT 1 FROM pg_database WHERE datname = 'pos_db';" 2>&1

    if ($checkDb -notmatch "1") {
        Write-Info "Creating database..."
        & psql -h $dbHost -U $dbUsername -p $dbPort -c "CREATE DATABASE pos_db;" | Out-Null

        if ($LASTEXITCODE -eq 0) {
            Write-Success "✓ Database 'pos_db' created successfully"
        } else {
            Write-Error-Custom "✗ Failed to create database"
            exit 1
        }
    } else {
        Write-Success "✓ Database 'pos_db' exists"
    }
}
catch {
    Write-Error-Custom "✗ Error creating database: $_"
    exit 1
}

Write-Host ""

# Update .env file
Write-Info "Step 5: Updating .env File..."

$envPath = "$PSScriptRoot\.env"

if (Test-Path $envPath) {
    # Read current .env
    $envContent = Get-Content $envPath

    # Update database settings
    $envContent = $envContent -replace 'DB_HOST=.*', "DB_HOST=$dbHost"
    $envContent = $envContent -replace 'DB_PORT=.*', "DB_PORT=$dbPort"
    $envContent = $envContent -replace 'DB_USERNAME=.*', "DB_USERNAME=$dbUsername"
    $envContent = $envContent -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$plainPassword"
    $envContent = $envContent -replace 'DB_DATABASE=.*', "DB_DATABASE=pos_db"

    # Write updated .env
    $envContent | Set-Content $envPath

    Write-Success "✓ .env file updated with credentials"
} else {
    Write-Error-Custom "✗ .env file not found at: $envPath"
    Write-Warning-Custom "Please create .env file manually with these settings:"
    Write-Host "DB_HOST=$dbHost"
    Write-Host "DB_PORT=$dbPort"
    Write-Host "DB_USERNAME=$dbUsername"
    Write-Host "DB_PASSWORD=$plainPassword"
    Write-Host "DB_DATABASE=pos_db"
}

Write-Host ""

# Clear password from environment
Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

# Test the connection with the new database
Write-Info "Step 6: Testing Connection to pos_db..."

try {
    $env:PGPASSWORD = $plainPassword
    & psql -h $dbHost -U $dbUsername -p $dbPort -d pos_db -c "\dt" 2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Successfully connected to pos_db"
    } else {
        Write-Error-Custom "✗ Could not connect to pos_db"
        exit 1
    }
}
catch {
    Write-Error-Custom "✗ Connection test failed: $_"
    exit 1
}
finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""

# Show next steps
Write-Success "================================"
Write-Success "  Setup Complete!"
Write-Success "================================"
Write-Host ""

Write-Info "Next Steps:"
Write-Host "1. Run the application:"
Write-Host "   cd $PSScriptRoot"
Write-Host "   npm run start:dev"
Write-Host ""
Write-Host "2. Database tables will be created automatically on first run"
Write-Host ""
Write-Host "3. Access the API at:"
Write-Host "   http://localhost:3000/api/v1"
Write-Host ""
Write-Host "4. View API documentation at:"
Write-Host "   http://localhost:3000/docs"
Write-Host ""
Write-Host "5. Default login credentials:"
Write-Host "   Username: admin"
Write-Host "   Password: admin123"
Write-Host ""

Write-Host "Happy coding! 🚀" -ForegroundColor Green
