# Complete Setup Instructions

## 🎯 Overview

This document provides step-by-step instructions to set up the eCommerce Admin Dashboard from scratch.

## 📋 Requirements

### System Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB free space

### Software Requirements
- Node.js v14.0.0 or higher
- PostgreSQL v12.0 or higher
- npm v6.0.0 or higher (comes with Node.js)
- Git v2.0 or higher

## 🔧 Installation Steps

### Step 1: Install Node.js

#### Windows:
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer (.msi file)
3. Follow the installation wizard
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### macOS:
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

#### Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version
npm --version
```

### Step 2: Install PostgreSQL

#### Windows:
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for 'postgres' user
4. Default port: 5432

#### macOS:
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

Verify PostgreSQL is running:
```bash
# Windows
pg_ctl status

# macOS/Linux
sudo systemctl status postgresql
```

### Step 3: Install Git

#### Windows:
Download from [git-scm.com](https://git-scm.com/download/win)

#### macOS:
```bash
brew install git
```

#### Linux:
```bash
sudo apt install git
```

Verify:
```bash
git --version
```

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vidusha-ranmini/eCommerce-Dashboard.git
cd eCommerce-Dashboard
```

### 2. Install Project Dependencies

```bash
npm install
```

This will install all required packages:
- express
- sequelize
- adminjs
- bcrypt
- jsonwebtoken
- pg
- and more...

Expected output:
```
added XXX packages in XXs
```

### 3. Configure Environment Variables

Create `.env` file:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
notepad .env
```

**macOS/Linux:**
```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

Update the following values in `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE

# JWT Configuration
JWT_SECRET=generate_random_string_here_min_32_chars
JWT_EXPIRES_IN=24h

# Session Configuration
SESSION_SECRET=another_random_string_here_min_32_chars

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeThisPassword123!
```

**Generating Strong Secrets:**

**Windows (PowerShell):**
```powershell
# Generate random secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**macOS/Linux:**
```bash
# Generate random secret
openssl rand -base64 32
```

### 4. Create PostgreSQL Database

#### Option A: Using psql command line

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql, run:
CREATE DATABASE ecommerce_db;

# Verify database was created
\l

# Exit psql
\q
```

#### Option B: Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases"
4. Select "Create" → "Database..."
5. Enter database name: `ecommerce_db`
6. Click "Save"

#### Option C: Using DBeaver

1. Open DBeaver
2. Create new connection to PostgreSQL
3. Right-click on connection
4. Select "Create" → "Database"
5. Name: `ecommerce_db`

### 5. Run Database Migrations

This creates all necessary tables:

```bash
npm run db:migrate
```

Expected output:
```
🔄 Starting database migration...
✅ Database connection established successfully.
📦 Syncing database models...
✅ Database migration completed successfully!
```

Tables created:
- users
- categories
- products
- orders
- order_items
- settings
- session (for AdminJS sessions)

### 6. Seed Sample Data

```bash
npm run db:seed
```

Expected output:
```
🌱 Starting database seeding...
👥 Creating users...
✅ Created 3 users
📁 Creating categories...
✅ Created 4 categories
📦 Creating products...
✅ Created 6 products
🛒 Creating orders...
✅ Created 3 orders
...
✨ Database seeding completed successfully!
```

This creates:
- **Users**: 1 admin + 2 regular users
- **Categories**: Electronics, Clothing, Books, Home & Garden
- **Products**: 6 sample products
- **Orders**: 3 sample orders with items
- **Settings**: 5 system configuration settings

### 7. Start the Development Server

```bash
npm run dev
```

Expected output:
```
✅ Database connection established successfully.
✅ Database synchronized

🚀 Server is running on port 3000
📊 AdminJS is available at http://localhost:3000/admin
🔌 API is available at http://localhost:3000/api
💚 Health check at http://localhost:3000/health
```

## ✅ Verification

### Test 1: Health Check

Open browser or use curl:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-13T...",
  "uptime": 123.45
}
```

### Test 2: Admin Login

1. Open browser: http://localhost:3000/admin
2. You should see AdminJS login page
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123` (or what you set in .env)
4. You should see the admin dashboard

### Test 3: API Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Test 4: Database Connection

```bash
# Connect to database
psql -U postgres -d ecommerce_db

# List tables
\dt

# View users
SELECT id, name, email, role FROM users;

# Exit
\q
```

## 🎨 Exploring the Application

### Admin Interface (http://localhost:3000/admin)

**As Admin (admin@example.com / admin123):**

1. **Dashboard**
   - View total users, products, orders
   - See revenue statistics
   - View recent orders

2. **User Management**
   - Create new users
   - Edit user details
   - Assign roles (admin/user)
   - Deactivate users

3. **Catalog Management**
   - **Categories**: Create and organize product categories
   - **Products**: Add, edit, delete products

4. **Order Management**
   - View all orders
   - Update order status
   - View order details and items

5. **Settings**
   - Configure system settings
   - Key-value configuration

**As Regular User (john@example.com / user123):**

1. **Dashboard**
   - View personal statistics
   - See your orders
   - Check spending

2. **Limited Access**
   - Cannot see Users
   - Cannot see Settings
   - Read-only access to products

### API Endpoints (http://localhost:3000/api)

Test with Postman, curl, or any HTTP client:

**1. Login:**
```bash
POST /api/login
Body: { "email": "admin@example.com", "password": "admin123" }
```

**2. Get Current User:**
```bash
GET /api/me
Headers: Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### Issue 1: "Cannot connect to database"

**Cause**: PostgreSQL not running or wrong credentials

**Solutions**:

1. Check PostgreSQL status:
   ```bash
   # Windows
   pg_ctl status
   
   # Linux/macOS
   sudo systemctl status postgresql
   ```

2. Start PostgreSQL:
   ```bash
   # Windows
   pg_ctl start
   
   # Linux/macOS
   sudo systemctl start postgresql
   ```

3. Verify credentials in `.env` match your PostgreSQL setup

4. Test connection manually:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### Issue 2: "Port 3000 already in use"

**Solutions**:

**Option A**: Change port in `.env`:
```env
PORT=3001
```

**Option B**: Kill process using port 3000:

Windows:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue 3: "npm install" fails

**Solutions**:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and try again:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Update npm:
   ```bash
   npm install -g npm@latest
   ```

### Issue 4: Migration fails

**Solutions**:

1. Drop and recreate database:
   ```bash
   psql -U postgres
   DROP DATABASE ecommerce_db;
   CREATE DATABASE ecommerce_db;
   \q
   ```

2. Run migration again:
   ```bash
   npm run db:migrate
   ```

### Issue 5: AdminJS shows blank page

**Solutions**:

1. Clear browser cache and cookies
2. Check browser console for errors (F12)
3. Verify database migrations ran successfully
4. Restart the server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Issue 6: JWT token invalid

**Solutions**:

1. Make sure `JWT_SECRET` hasn't changed
2. Token might be expired (default: 24h)
3. Login again to get new token

### Issue 7: "bcrypt" installation error on Windows

**Solution**:

1. Install windows-build-tools:
   ```powershell
   npm install -g windows-build-tools
   ```

2. Install bcrypt separately:
   ```bash
   npm install bcrypt --save
   ```

## 📊 Database Schema

Quick reference of the database structure:

```
users
├── id (PK)
├── name
├── email (unique)
├── password (hashed)
├── role (admin/user)
└── isActive

categories
├── id (PK)
├── name (unique)
├── slug (unique)
└── description

products
├── id (PK)
├── name
├── price
├── stock
├── sku (unique)
├── categoryId (FK → categories)
└── imageUrl

orders
├── id (PK)
├── orderNumber (unique)
├── userId (FK → users)
├── totalAmount
├── status
└── paymentStatus

order_items
├── id (PK)
├── orderId (FK → orders)
├── productId (FK → products)
├── quantity
├── price
└── subtotal

settings
├── id (PK)
├── key (unique)
├── value
└── type
```

## 🚀 Next Steps

1. **Read Documentation**
   - [README.md](README.md) - Full project documentation
   - [QUICKSTART.md](docs/QUICKSTART.md) - Quick start guide
   - [API.md](docs/API.md) - API documentation

2. **Customize**
   - Modify models in `src/models/`
   - Update AdminJS resources in `src/adminjs/`
   - Add new API endpoints in `src/routes/`

3. **Deploy**
   - Follow [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment

4. **Contribute**
   - Read [CONTRIBUTING.md](CONTRIBUTING.md)
   - Submit issues or pull requests

## 📞 Getting Help

If you're stuck:

1. Check this setup guide
2. Read the [README.md](README.md)
3. Search existing GitHub issues
4. Create a new issue with:
   - Your OS and versions (Node, PostgreSQL)
   - Steps you followed
   - Error messages
   - Screenshots

## 🎉 Success!

If you see the server running and can log in to AdminJS, congratulations! You've successfully set up the eCommerce Admin Dashboard.

Happy coding! 🚀
