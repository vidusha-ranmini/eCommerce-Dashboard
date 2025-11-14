# 🎯 Command Reference Guide

Quick reference for all available commands in this project.

## 📦 NPM Commands

### Development & Production

```bash
# Start development server (with auto-reload using nodemon)
npm run dev

# Start production server
npm start
```

### Database Management

```bash
# Run database migrations (create/update tables)
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Full database reset (migrate + seed)
npm run db:migrate && npm run db:seed
```

### Package Management

```bash
# Install all dependencies
npm install

# Install a new package
npm install package-name

# Install as dev dependency
npm install --save-dev package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🗄️ PostgreSQL Commands

### Database Management

```bash
# Connect to PostgreSQL
psql -U postgres

# Connect to specific database
psql -U postgres -d ecommerce_db

# List all databases
psql -U postgres -c "\l"

# Create database
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# Drop database (WARNING: Deletes all data!)
psql -U postgres -c "DROP DATABASE ecommerce_db;"

# Backup database
pg_dump -U postgres ecommerce_db > backup.sql

# Restore database
psql -U postgres ecommerce_db < backup.sql
```

### Inside psql

```sql
-- List all databases
\l

-- Connect to database
\c ecommerce_db

-- List all tables
\dt

-- Describe table structure
\d users

-- View table data
SELECT * FROM users;

-- Count records
SELECT COUNT(*) FROM users;

-- Exit psql
\q
```

## 🐳 Git Commands

### Basic Workflow

```bash
# Check status
git status

# Stage all changes
git add .

# Stage specific file
git add filename

# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin branch-name

# Pull from remote
git pull origin branch-name
```

### Branch Management

```bash
# List all branches
git branch

# Create new branch
git checkout -b feature/new-feature

# Switch to branch
git checkout branch-name

# Delete branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Merge branch
git checkout main
git merge feature/new-feature
```

### Repository Setup

```bash
# Initialize git repository
git init

# Add remote
git remote add origin https://github.com/username/repo.git

# View remotes
git remote -v

# Push first commit
git push -u origin main
```

### Commit Types (Conventional Commits)

```bash
# New feature
git commit -m "feat: add user authentication"

# Bug fix
git commit -m "fix: correct order calculation"

# Documentation
git commit -m "docs: update README"

# Code refactoring
git commit -m "refactor: simplify user model"

# Performance improvement
git commit -m "perf: optimize database queries"

# Tests
git commit -m "test: add user controller tests"

# Build/Dependencies
git commit -m "chore: update dependencies"

# Styling changes
git commit -m "style: format code"
```

## 🌐 cURL Commands (API Testing)

### Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get current user
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Health check
curl http://localhost:3000/health
```

### Pretty Print JSON Response

```bash
# Using jq (install: apt install jq or brew install jq)
curl http://localhost:3000/health | jq

# Using Python
curl http://localhost:3000/health | python -m json.tool
```

## 🔧 System Commands

### Check Versions

```bash
# Node.js version
node --version
node -v

# npm version
npm --version
npm -v

# PostgreSQL version
psql --version

# Git version
git --version
```

### Process Management

```bash
# Windows PowerShell - Find process on port
netstat -ano | findstr :3000

# Windows PowerShell - Kill process
taskkill /PID <PID> /F

# Linux/macOS - Find process on port
lsof -ti:3000

# Linux/macOS - Kill process
kill -9 $(lsof -ti:3000)

# Or use killall (macOS/Linux)
killall node
```

### Port Management

```bash
# Check if port is in use (Windows)
netstat -ano | findstr :3000

# Check if port is in use (Linux/macOS)
lsof -i :3000

# Change port in .env file
# Edit .env: PORT=3001
```

## 📊 Database Query Examples

### User Queries

```sql
-- View all users
SELECT id, name, email, role FROM users;

-- Find admin users
SELECT * FROM users WHERE role = 'admin';

-- Find active users
SELECT * FROM users WHERE "isActive" = true;

-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;
```

### Product Queries

```sql
-- View all products with category
SELECT p.name, p.price, c.name as category 
FROM products p 
JOIN categories c ON p."categoryId" = c.id;

-- Low stock products
SELECT name, stock FROM products WHERE stock < 10;

-- Products by category
SELECT * FROM products WHERE "categoryId" = 1;
```

### Order Queries

```sql
-- View all orders with user
SELECT o."orderNumber", u.name, o."totalAmount", o.status 
FROM orders o 
JOIN users u ON o."userId" = u.id;

-- Pending orders
SELECT * FROM orders WHERE status = 'pending';

-- Total revenue
SELECT SUM("totalAmount") FROM orders WHERE "paymentStatus" = 'paid';

-- Orders by user
SELECT * FROM orders WHERE "userId" = 1;
```

### Complex Queries

```sql
-- Order details with items and products
SELECT 
  o."orderNumber",
  u.name as customer,
  p.name as product,
  oi.quantity,
  oi.price,
  oi.subtotal
FROM order_items oi
JOIN orders o ON oi."orderId" = o.id
JOIN users u ON o."userId" = u.id
JOIN products p ON oi."productId" = p.id;

-- Top selling products
SELECT 
  p.name,
  SUM(oi.quantity) as total_sold
FROM order_items oi
JOIN products p ON oi."productId" = p.id
GROUP BY p.name
ORDER BY total_sold DESC
LIMIT 5;

-- Revenue by user
SELECT 
  u.name,
  COUNT(o.id) as order_count,
  SUM(o."totalAmount") as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o."userId"
WHERE o."paymentStatus" = 'paid'
GROUP BY u.name;
```

## 🔍 Debugging Commands

### View Logs

```bash
# View server logs (if using nodemon)
npm run dev

# View PostgreSQL logs (location varies by OS)
# Linux
tail -f /var/log/postgresql/postgresql-14-main.log

# macOS (Homebrew)
tail -f /usr/local/var/log/postgresql@14.log
```

### Test Database Connection

```bash
# Test connection
psql -U postgres -h localhost -p 5432 -d ecommerce_db

# Test with connection string
psql "postgresql://postgres:password@localhost:5432/ecommerce_db"
```

### Check Running Processes

```bash
# Windows
tasklist | findstr node

# Linux/macOS
ps aux | grep node
```

## 🛠️ Maintenance Commands

### Clean Up

```bash
# Remove node_modules
rm -rf node_modules

# Remove package-lock.json
rm package-lock.json

# Fresh install
npm install

# Clear npm cache
npm cache clean --force
```

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all to latest
npm update

# Update specific package
npm update package-name

# Install latest version
npm install package-name@latest
```

## 🚀 Deployment Commands

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set KEY=value

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Run migrations
heroku run npm run db:migrate

# Open app
heroku open
```

### PM2 (Production Server)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name ecommerce-admin

# List processes
pm2 list

# View logs
pm2 logs

# Restart
pm2 restart ecommerce-admin

# Stop
pm2 stop ecommerce-admin

# Delete
pm2 delete ecommerce-admin

# Save configuration
pm2 save

# Startup script
pm2 startup
```

## 📱 Useful Aliases (Optional)

Add to `.bashrc`, `.zshrc`, or PowerShell profile:

```bash
# Development
alias dev="npm run dev"
alias prod="npm start"

# Database
alias dbmigrate="npm run db:migrate"
alias dbseed="npm run db:seed"
alias dbreset="npm run db:migrate && npm run db:seed"

# Git
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline"

# PostgreSQL
alias pgstart="sudo systemctl start postgresql"
alias pgstop="sudo systemctl stop postgresql"
alias pgstatus="sudo systemctl status postgresql"
```

## 🎓 Learning Commands

### Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test login (save token)
TOKEN=$(curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.token')

# Use saved token
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer $TOKEN"
```

### Database Inspection

```bash
# Count all records in each table
psql -U postgres -d ecommerce_db -c "
SELECT 
  'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'settings', COUNT(*) FROM settings;"
```

## 📋 Quick Reference Card

```
DEVELOPMENT:
  npm run dev              - Start dev server
  npm run db:migrate       - Run migrations
  npm run db:seed          - Seed database

GIT:
  git status               - Check status
  git add .                - Stage all
  git commit -m "msg"      - Commit
  git push                 - Push changes

DATABASE:
  psql -U postgres         - Connect to PostgreSQL
  \c ecommerce_db          - Use database
  \dt                      - List tables
  SELECT * FROM users;     - Query users

API:
  POST /api/login          - Login
  GET  /api/me             - Current user
  GET  /health             - Health check

PORTS:
  3000                     - Application
  5432                     - PostgreSQL

URLS:
  localhost:3000/admin     - AdminJS
  localhost:3000/api       - API
```

---

💡 **Tip**: Save this file for quick reference during development!

For more detailed information, see the full documentation in `README.md` and `docs/` folder.
