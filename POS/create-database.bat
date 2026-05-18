@echo off
REM PostgreSQL Database Creation Script for POS System
REM This script creates the pos_db database

echo ================================
echo  Creating pos_db Database
echo ================================
echo.

REM Set password
set PGPASSWORD=2612

REM Create database
echo Creating database pos_db...
psql -U postgres -h localhost -c "CREATE DATABASE pos_db;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database pos_db created successfully!
    echo.
    echo Next steps:
    echo 1. Run: npm run start:dev
    echo 2. Database tables will be created automatically
    echo 3. Open: http://localhost:3000/docs
    echo.
) else (
    if exist "C:\Program Files\PostgreSQL\18\bin\psql.exe" (
        echo.
        echo Database may already exist or connection failed.
        echo Try running from PostgreSQL command line:
        echo "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -h localhost
        echo Then run: CREATE DATABASE pos_db;
        echo.
    ) else (
        echo.
        echo ✗ PostgreSQL bin directory not found in PATH
        echo Please add PostgreSQL 18 bin to your system PATH
        echo Path should be: C:\Program Files\PostgreSQL\18\bin
        echo.
    )
)

pause
