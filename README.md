# eCommerce Admin Dashboard

A secure Role-Based eCommerce Admin Dashboard built with AdminJS, Sequelize, and PostgreSQL featuring JWT authentication, role-based access control, and customizable dashboard pages.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-v4+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Role-Based Access Control](#role-based-access-control)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- ✅ **JWT-based Authentication** - Secure user authentication with JSON Web Tokens
- ✅ **Role-Based Access Control (RBAC)** - Admin and User roles with different permissions
- ✅ **Secure Password Hashing** - bcrypt password encryption
- ✅ **AdminJS Integration** - Beautiful and customizable admin interface
- ✅ **PostgreSQL Database** - Robust relational database with Sequelize ORM
- ✅ **RESTful API** - Well-structured API endpoints
- ✅ **Custom Dashboard** - Role-specific dashboard views
- ✅ **Settings Management** - Key-value configuration system

### Database Models
- 👤 **Users** - User management with role assignment
- 📁 **Categories** - Product categorization
- 📦 **Products** - Product inventory management
- 🛒 **Orders** - Order processing and tracking
- 📋 **Order Items** - Individual items in orders
- ⚙️ **Settings** - System configuration

### Role Permissions

#### Admin
- Full access to all resources
- User management (create, edit, delete)
- View system-wide statistics
- Access to Settings
- Custom admin dashboard with:
  - Total users, products, orders
  - Revenue tracking
  - Recent orders overview

#### Regular User
- Limited dashboard access
- View personal orders only
- Cannot access Users or Settings
- Personal statistics:
  - Total orders
  - Total spent
  - Recent order history

## 🛠️ Tech Stack

- **Backend Framework**: Node.js + Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Admin Panel**: AdminJS
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Session Management**: express-session with connect-pg-simple
- **Environment Variables**: dotenv

## 📁 Project Structure

```
eCommerce-Dashboard/
├── src/
│   ├── adminjs/
│   │   ├── components/
│   │   │   └── dashboard.jsx        # Custom dashboard component
│   │   ├── componentLoader.js       # AdminJS component loader
│   │   ├── dashboardHandler.js      # Dashboard data handler
│   │   ├── index.js                 # AdminJS configuration
│   │   └── resources.js             # Resource configurations
│   ├── config/
│   │   └── database.js              # Database connection config
│   ├── controllers/
│   │   └── authController.js        # Authentication logic
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── models/
│   │   ├── Category.js              # Category model
│   │   ├── Order.js                 # Order model
│   │   ├── OrderItem.js             # OrderItem model
│   │   ├── Product.js               # Product model
│   │   ├── Setting.js               # Setting model
│   │   ├── User.js                  # User model
│   │   └── index.js                 # Model relationships
│   ├── routes/
│   │   └── authRoutes.js            # API routes
│   ├── scripts/
│   │   ├── migrate.js               # Database migration script
│   │   └── seed.js                  # Database seeding script
│   └── server.js                    # Main application entry point
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Project dependencies
└── README.md                        # Project documentation
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vidusha-ranmini/eCommerce-Dashboard.git
cd eCommerce-Dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# Session Configuration
SESSION_SECRET=your_super_secret_session_key_change_this_in_production

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

⚠️ **Important**: Change the `JWT_SECRET` and `SESSION_SECRET` to strong, random values in production!

## 💾 Database Setup

### 1. Create PostgreSQL Database

Using PostgreSQL command line:

```bash
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

Or using pgAdmin or any PostgreSQL GUI tool.

### 2. Run Database Migration

This will create all necessary tables:

```bash
npm run db:migrate
```

### 3. Seed the Database

This will populate the database with sample data:

```bash
npm run db:seed
```

The seed script creates:
- 1 Admin user
- 2 Regular users
- 4 Product categories
- 6 Sample products
- 3 Sample orders with items
- 5 System settings

**Default Credentials:**

Admin:
- Email: `admin@example.com` (or from .env)
- Password: `admin123` (or from .env)

Regular Users:
- Email: `john@example.com` / Password: `user123`
- Email: `jane@example.com` / Password: `user123`

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The application will be available at:
- **AdminJS Dashboard**: http://localhost:3000/admin
- **API Endpoints**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /api/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Success Response (200):**
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

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

#### GET /api/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
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

### Using the API with cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Current User:**
```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔐 Role-Based Access Control

### Resource Visibility

| Resource | Admin | User |
|----------|-------|------|
| Users | ✅ Full Access | ❌ No Access |
| Categories | ✅ Full Access | 👁️ View Only |
| Products | ✅ Full Access | 👁️ View Only |
| Orders | ✅ Full Access | 👁️ View Own Orders |
| Order Items | ✅ Full Access | 👁️ View Own Items |
| Settings | ✅ Full Access | ❌ No Access |

### Dashboard Views

**Admin Dashboard Shows:**
- Total Users
- Total Products
- Total Orders
- Total Revenue
- Pending Orders Count
- Recent Orders (All Users)

**User Dashboard Shows:**
- User Profile Information
- Personal Order Count
- Total Amount Spent
- Recent Personal Orders

### Implementation Details

The role-based access is implemented using AdminJS's `isAccessible` and `isVisible` options:

```javascript
// Example from resources.js
isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
```

## 🌿 Git Workflow

### Recommended Branch Strategy

```bash
main            # Production-ready code
├── develop     # Development branch
├── feature/*   # Feature branches
├── bugfix/*    # Bug fix branches
└── hotfix/*    # Production hotfixes
```

### Creating a Feature Branch

```bash
# Create and switch to a new feature branch
git checkout -b feature/add-payment-gateway

# Make your changes
git add .
git commit -m "feat: add payment gateway integration"

# Push to remote
git push origin feature/add-payment-gateway
```

### Commit Message Convention

Follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Example Workflow

```bash
# Clone the repository
git clone https://github.com/vidusha-ranmini/eCommerce-Dashboard.git
cd eCommerce-Dashboard

# Create a development branch
git checkout -b develop

# Create a feature branch
git checkout -b feature/new-feature

# After making changes
git add .
git commit -m "feat: implement new feature"

# Push to remote
git push origin feature/new-feature

# Create a pull request on GitHub
# Merge to develop after review
# Eventually merge to main for production
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: "Unable to connect to the database"

**Solution**:
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   
   # Linux/Mac
   sudo service postgresql status
   ```

2. Check your `.env` database credentials
3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

**Problem**: "Port 3000 is already in use"

**Solution**:
1. Change the PORT in `.env`
2. Or kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

### AdminJS Not Loading

**Problem**: AdminJS interface not accessible

**Solution**:
1. Check if server is running: `http://localhost:3000/health`
2. Verify database migration: `npm run db:migrate`
3. Check browser console for errors
4. Clear browser cache and cookies

### JWT Token Issues

**Problem**: "Token is not valid"

**Solution**:
1. Verify `JWT_SECRET` in `.env` matches across restarts
2. Check token expiration (default 24h)
3. Ensure Authorization header format: `Bearer <token>`

### Seed Data Not Creating

**Problem**: Seed script fails or no data appears

**Solution**:
1. Run migration first: `npm run db:migrate`
2. Check for database constraint violations
3. Verify database is empty or use `force: true` carefully
4. Check console output for specific errors

## 📝 Development Tips

### Adding a New Model

1. Create model file in `src/models/`
2. Define relationships in `src/models/index.js`
3. Create resource configuration in `src/adminjs/resources.js`
4. Add to AdminJS in `src/adminjs/index.js`
5. Run migration: `npm run db:migrate`

### Customizing the Dashboard

Edit `src/adminjs/components/dashboard.jsx` to customize the dashboard view.

### Adding Custom Actions

Add custom actions in resource configurations:

```javascript
actions: {
  myCustomAction: {
    actionType: 'record',
    handler: async (request, response, context) => {
      // Your logic here
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [AdminJS](https://adminjs.co/) - Admin panel framework
- [Sequelize](https://sequelize.org/) - ORM for Node.js
- [Express.js](https://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@example.com

---

Made with ❤️ by the eCommerce Dashboard Team
