-- PostgreSQL Database Setup Script for POS System
-- Run this in pgAdmin 4 or psql command line

-- Create database
CREATE DATABASE pos_db;

-- Connect to the database
\c pos_db

-- Create schema and tables
-- This will be auto-created by TypeORM, but you can run this for reference

-- Grant privileges (optional, if using a specific user)
-- GRANT ALL PRIVILEGES ON DATABASE pos_db TO postgres;

-- Verify database creation
SELECT datname FROM pg_database WHERE datname = 'pos_db';
