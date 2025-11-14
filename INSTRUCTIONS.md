# 🚀 Complete Setup and Usage Instructions

## Welcome to the eCommerce Admin Dashboard!

This guide will take you from zero to a fully running application in just a few minutes.

---

## 📋 Table of Contents

1. [Quick Start (5 Minutes)](#quick-start-5-minutes)
2. [Detailed Setup](#detailed-setup)
3. [First Login](#first-login)
4. [Using the Admin Panel](#using-the-admin-panel)
5. [Using the API](#using-the-api)
6. [Understanding Roles](#understanding-roles)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## ⚡ Quick Start (5 Minutes)

If you have Node.js and PostgreSQL already installed:

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL password

# 3. Create database
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# 4. Run migrations and seed data
npm run db:migrate
npm run db:seed

# 5. Start the server
npm run dev
```

**Done!** Open http://localhost:3000/admin and login with:
- Email: `admin@example.com`
- Password: `admin123`

---

## 📖 Detailed Setup

### Prerequisites

Before you begin, install these:

#### 1. Node.js (v14 or higher)
- **Download**: https://nodejs.org/
- **Verify**: `node --version`

#### 2. PostgreSQL (v12 or higher)
- **Download**: https://www.postgresql.org/download/
- **Verify**: `psql --version`
- **Remember**: Save your postgres password!

#### 3. Git
- **Download**: https://git-scm.com/
- **Verify**: `git --version`

### Step-by-Step Installation

#### Step 1: Get the Code

**Option A: Clone from GitHub**
```bash
git clone https://github.com/vidusha-ranmini/eCommerce-Dashboard.git
cd eCommerce-Dashboard
```

**Option B: If you already have the folder**
```bash
cd eCommerce-Dashboard
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Express.js (web server)
- Sequelize (database ORM)
- AdminJS (admin interface)
- bcrypt (password encryption)
- jsonwebtoken (JWT tokens)
- PostgreSQL driver
- And more...

**Wait for it to complete** (may take 1-2 minutes)

#### Step 3: Configure Environment

**Windows:**
```powershell
Copy-Item .env.example .env
notepad .env
```

**Mac/Linux:**
```bash
cp .env.example .env
nano .env  # or use your favorite editor
```

**Update these values in .env:**

```env
# REQUIRED: Your PostgreSQL password
DB_PASSWORD=your_postgres_password_here

# OPTIONAL: Change these for security
JWT_SECRET=your_random_secret_key_here
SESSION_SECRET=another_random_secret_here

# OPTIONAL: Custom admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

💡 **Tip**: Generate secure secrets:
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

#### Step 4: Setup Database

**Create the database:**

**Option A: Using psql command line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE ecommerce_db;

# Verify it was created
\l

# Exit psql
\q
```

**Option B: Using pgAdmin** (GUI tool)
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `ecommerce_db`
5. Click "Save"

**Option C: One-line command**
```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

#### Step 5: Run Database Migrations

This creates all the tables:

```bash
npm run db:migrate
```

**You should see:**
```
✅ Database connection established successfully.
📦 Syncing database models...
✅ Database migration completed successfully!
```

**Tables created:**
- users
- categories
- products
- orders
- order_items
- settings
- session

#### Step 6: Seed Sample Data

This adds example data to work with:

```bash
npm run db:seed
```

**You should see:**
```
🌱 Starting database seeding...
✅ Created 3 users
✅ Created 4 categories
✅ Created 6 products
✅ Created 3 orders
✨ Database seeding completed successfully!

🔑 Admin credentials:
   Email: admin@example.com
   Password: admin123
```

**Sample data includes:**
- 1 Admin user
- 2 Regular users
- 4 Product categories
- 6 Sample products
- 3 Orders with items
- 5 System settings

#### Step 7: Start the Server

**Development mode (recommended):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**You should see:**
```
🚀 Server is running on port 3000
📊 AdminJS is available at http://localhost:3000/admin
🔌 API is available at http://localhost:3000/api
💚 Health check at http://localhost:3000/health
```

---

## 🎯 First Login

### Access the Admin Panel

1. **Open your browser**
2. **Navigate to**: http://localhost:3000/admin
3. **You should see the login page**

### Login as Admin

**Credentials:**
- **Email**: `admin@example.com`
- **Password**: `admin123` (or what you set in .env)

**After login, you'll see:**
- Dashboard with system statistics
- Navigation menu on the left
- All resources (Users, Products, Orders, etc.)

### Test Different Roles

**Try logging in as a regular user:**
- **Email**: `john@example.com`
- **Password**: `user123`

**Notice the differences:**
- Limited navigation menu
- Can't see Users or Settings
- Only sees personal orders

---

## 🎨 Using the Admin Panel

### Admin Dashboard

When logged in as admin, you'll see:

**Statistics Cards:**
- 📊 Total Users
- 📦 Total Products
- 🛒 Total Orders
- 💰 Total Revenue

**Recent Orders Table:**
- Order number
- Customer name
- Amount
- Status
- Date

### Managing Resources

#### Users (Admin Only)

**View all users:**
1. Click "Users" in the sidebar
2. See list of all users

**Create new user:**
1. Click "Create new" button
2. Fill in the form:
   - Name
   - Email
   - Password
   - Role (admin or user)
   - Is Active (checkbox)
3. Click "Save"

**Edit user:**
1. Click on a user from the list
2. Click "Edit"
3. Make changes
4. Click "Save"

**Delete user:**
1. Click on a user
2. Click "Delete"
3. Confirm deletion

#### Categories

**Create category:**
1. Click "Categories" under "Catalog"
2. Click "Create new"
3. Fill in:
   - Name (required)
   - Description
   - Is Active
4. Slug is auto-generated from name
5. Click "Save"

**Edit/Delete:** Similar to Users

#### Products

**Create product:**
1. Click "Products" under "Catalog"
2. Click "Create new"
3. Fill in:
   - Name (required)
   - Description
   - Price (required)
   - Stock (required)
   - SKU (required, unique)
   - Category (select from dropdown)
   - Image URL
   - Is Active
4. Click "Save"

**View products with categories:**
- List view shows category name
- Detail view shows full category info

#### Orders

**View orders:**
1. Click "Orders" under "Orders"
2. See all orders with:
   - Order number
   - Customer name/email
   - Total amount
   - Status
   - Payment status

**Update order status:**
1. Click on an order
2. Click "Edit"
3. Change status:
   - pending
   - processing
   - shipped
   - delivered
   - cancelled
4. Click "Save"

**View order items:**
1. From order detail page
2. See all items in the order
3. Quantities and prices

#### Settings (Admin Only)

**View settings:**
1. Click "Settings" under "Configuration"
2. See all configuration keys

**Update setting:**
1. Click on a setting
2. Click "Edit"
3. Change the value
4. Click "Save"

**Example settings:**
- site_name
- tax_rate
- free_shipping_threshold
- maintenance_mode
- contact_info

---

## 🔌 Using the API

### Getting Started with API

The API is available at: http://localhost:3000/api

### Login to Get Token

**Request:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Response:**
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

**Save the token!** You'll need it for protected routes.

### Get Current User

**Request:**
```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

### Health Check

**Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-13T12:00:00.000Z",
  "uptime": 3600.5
}
```

### Using Postman

1. **Import API Collection:**
   - Create new collection
   - Add requests from API.md

2. **Set Environment Variables:**
   - baseUrl: `http://localhost:3000`
   - token: (paste your JWT token)

3. **Use Variables:**
   - URL: `{{baseUrl}}/api/login`
   - Header: `Authorization: Bearer {{token}}`

---

## 👥 Understanding Roles

### Admin Role

**Full Access:**
- ✅ View all users
- ✅ Create, edit, delete users
- ✅ Assign roles to users
- ✅ View all orders (from all users)
- ✅ Create, edit, delete products
- ✅ Create, edit, delete categories
- ✅ View and edit settings
- ✅ Access full dashboard with system stats

**Dashboard Shows:**
- Total users in system
- Total products
- Total orders
- Total revenue
- Pending orders count
- Recent orders from all users

### User Role

**Limited Access:**
- ✅ View own profile
- ✅ View own orders only
- ✅ View products (read-only)
- ✅ View categories (read-only)
- ❌ Cannot see other users
- ❌ Cannot see settings
- ❌ Cannot create/edit products
- ❌ Cannot delete anything

**Dashboard Shows:**
- Welcome message with name
- Total personal orders
- Total amount spent
- Recent personal orders

### Changing User Role

**As admin:**
1. Go to Users
2. Click on a user
3. Click "Edit"
4. Change "Role" to "admin" or "user"
5. Click "Save"

---

## 📝 Common Tasks

### Reset Database

**Warning:** This deletes ALL data!

```bash
# 1. Drop and recreate database
psql -U postgres -c "DROP DATABASE ecommerce_db;"
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# 2. Run migrations
npm run db:migrate

# 3. Seed fresh data
npm run db:seed
```

### Add a New Admin User

**Method 1: Through AdminJS**
1. Login as admin
2. Go to Users
3. Create new user
4. Set role to "admin"

**Method 2: Through Database**
```bash
psql -U postgres -d ecommerce_db
```

```sql
INSERT INTO users (name, email, password, role, "isActive", "createdAt", "updatedAt")
VALUES (
  'New Admin',
  'newadmin@example.com',
  -- Password must be hashed! Use the UI instead
  '$2b$10$...',
  'admin',
  true,
  NOW(),
  NOW()
);
```

**Note:** It's easier and safer to create users through the UI!

### Change Admin Password

**Method 1: Through UI**
1. Login as admin
2. Go to Users
3. Find admin user
4. Click "Edit"
5. Enter new password
6. Click "Save"

**Method 2: Update .env and reseed**
1. Edit `.env`
2. Change `ADMIN_PASSWORD`
3. Reset database
4. Run `npm run db:seed`

### Export Data

**Using psql:**
```bash
# Export all data
pg_dump -U postgres ecommerce_db > backup.sql

# Export specific table
pg_dump -U postgres -t users ecommerce_db > users_backup.sql
```

### Import Data

```bash
# Import from backup
psql -U postgres ecommerce_db < backup.sql
```

### View Database in GUI

**Recommended Tools:**
- **pgAdmin**: Free, comes with PostgreSQL
- **DBeaver**: Free, works with many databases
- **TablePlus**: Paid, beautiful UI
- **DataGrip**: Paid, by JetBrains

---

## 🐛 Troubleshooting

### Server Won't Start

**Problem:** "Error: connect ECONNREFUSED"

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   
   # Linux/macOS
   sudo systemctl status postgresql
   ```

2. Verify database credentials in `.env`
3. Test connection manually:
   ```bash
   psql -U postgres -d ecommerce_db
   ```

### Port Already in Use

**Problem:** "Port 3000 already in use"

**Solution 1:** Kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

**Solution 2:** Change port in `.env`:
```env
PORT=3001
```

### Can't Login to AdminJS

**Problem:** "Invalid credentials"

**Solutions:**
1. Verify credentials are correct
2. Check database has users:
   ```bash
   psql -U postgres -d ecommerce_db -c "SELECT email, role FROM users;"
   ```

3. Reseed database:
   ```bash
   npm run db:seed
   ```

### Tables Not Found

**Problem:** "relation does not exist"

**Solution:** Run migrations:
```bash
npm run db:migrate
```

### Dependencies Not Installing

**Problem:** npm install fails

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node version:
   ```bash
   node --version  # Should be v14+
   ```

---

## 🎓 Next Steps

### Learn More

1. **Read Documentation:**
   - `README.md` - Complete overview
   - `docs/API.md` - API reference
   - `docs/DEPLOYMENT.md` - Deploy to production
   - `ARCHITECTURE.md` - System architecture

2. **Explore the Code:**
   - `src/models/` - Database structure
   - `src/adminjs/` - AdminJS configuration
   - `src/controllers/` - Business logic

3. **Watch Videos:**
   - AdminJS documentation: https://docs.adminjs.co/
   - Sequelize tutorials: https://sequelize.org/

### Customize the Project

1. **Add New Models:**
   - Create model file in `src/models/`
   - Add relationships in `src/models/index.js`
   - Configure resource in `src/adminjs/resources.js`
   - Run `npm run db:migrate`

2. **Modify Dashboard:**
   - Edit `src/adminjs/components/dashboard.jsx`
   - Update `src/adminjs/dashboardHandler.js`

3. **Add API Endpoints:**
   - Create controller in `src/controllers/`
   - Add routes in `src/routes/`
   - Register in `src/server.js`

### Deploy to Production

Follow the deployment guide in `docs/DEPLOYMENT.md` for:
- Heroku
- Railway
- DigitalOcean
- AWS

### Contribute

Want to improve this project?
1. Read `CONTRIBUTING.md`
2. Fork the repository
3. Make your changes
4. Submit a pull request

---

## 📞 Getting Help

### Documentation

- **README.md**: Main documentation
- **docs/** folder: Detailed guides
- **COMMANDS.md**: Command reference
- **ARCHITECTURE.md**: System diagrams

### Support Channels

- **GitHub Issues**: Report bugs or ask questions
- **Discussions**: Community help
- **Email**: support@example.com

### Useful Links

- **AdminJS Docs**: https://docs.adminjs.co/
- **Sequelize Docs**: https://sequelize.org/
- **Express.js Docs**: https://expressjs.com/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## ✅ Quick Reference

### URLs
- Admin Panel: http://localhost:3000/admin
- API: http://localhost:3000/api
- Health Check: http://localhost:3000/health

### Default Credentials
- Admin: admin@example.com / admin123
- User: john@example.com / user123

### Commands
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed sample data
```

### Ports
- Application: 3000
- PostgreSQL: 5432

---

## 🎉 Congratulations!

You now have a fully functional eCommerce Admin Dashboard!

**What you can do:**
- ✅ Manage users with different roles
- ✅ CRUD operations on products, categories, orders
- ✅ Secure authentication with JWT
- ✅ Beautiful admin interface with AdminJS
- ✅ RESTful API for integration
- ✅ Role-based access control

**Next steps:**
- Customize the dashboard
- Add new features
- Deploy to production
- Build your eCommerce platform!

Happy coding! 🚀

---

**Need help?** Check the documentation or create an issue on GitHub.

**Want to contribute?** Read CONTRIBUTING.md and submit a PR!
