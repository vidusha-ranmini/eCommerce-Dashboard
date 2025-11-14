# Quick Start Guide

Get up and running with the eCommerce Admin Dashboard in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 14+ installed
- [ ] PostgreSQL 12+ installed and running
- [ ] Git installed
- [ ] Basic knowledge of terminal/command line

## Step-by-Step Setup

### 1. Clone the Repository (30 seconds)

```bash
git clone https://github.com/vidusha-ranmini/eCommerce-Dashboard.git
cd eCommerce-Dashboard
```

### 2. Install Dependencies (1-2 minutes)

```bash
npm install
```

### 3. Setup Environment Variables (1 minute)

Create a `.env` file:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Edit `.env` and update these values:
```env
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=change_this_to_random_string
SESSION_SECRET=change_this_to_another_random_string
```

### 4. Create Database (1 minute)

**Option A: Using psql command line**
```bash
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

**Option B: Using pgAdmin**
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name it `ecommerce_db`

### 5. Run Database Migrations (30 seconds)

```bash
npm run db:migrate
```

You should see: ✅ Database migration completed successfully!

### 6. Seed Sample Data (30 seconds)

```bash
npm run db:seed
```

This creates:
- 1 Admin user (admin@example.com / admin123)
- 2 Regular users
- Sample products and orders

### 7. Start the Application (10 seconds)

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 3000
📊 AdminJS is available at http://localhost:3000/admin
```

### 8. Login to Admin Panel

Open your browser and go to:
```
http://localhost:3000/admin
```

**Admin Login:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User Login:**
- Email: `john@example.com`
- Password: `user123`

## What to Try Next

### As Admin:
1. **Dashboard**: View system statistics
2. **Users**: Manage all users
3. **Products**: Add/edit products
4. **Orders**: View and manage all orders
5. **Settings**: Configure system settings

### As Regular User:
1. **Dashboard**: View personal statistics
2. **Orders**: View your orders only
3. **Products**: Browse products (read-only)

## Testing the API

### Login via API:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Save the token from the response, then:

```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues & Quick Fixes

### Issue: Database connection failed

**Fix:**
1. Make sure PostgreSQL is running
2. Check your `.env` credentials
3. Verify database exists: `psql -U postgres -l`

### Issue: Port 3000 already in use

**Fix:**
Change PORT in `.env` to another number (e.g., 3001)

### Issue: Module not found

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Migrations not working

**Fix:**
```bash
# Drop and recreate database (WARNING: loses all data)
psql -U postgres
DROP DATABASE ecommerce_db;
CREATE DATABASE ecommerce_db;
\q

# Run migrations again
npm run db:migrate
npm run db:seed
```

## Project Structure Overview

```
eCommerce-Dashboard/
├── src/
│   ├── adminjs/         # AdminJS configuration
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Main entry point
├── .env                 # Your configuration
└── package.json         # Dependencies
```

## Next Steps

1. **Explore the Code**: Check out `src/models/` to see database structure
2. **Read Full Documentation**: See `README.md` for detailed info
3. **Customize**: Modify models, add features
4. **Deploy**: Follow `docs/DEPLOYMENT.md` when ready

## Need Help?

- 📖 Read the full [README.md](../README.md)
- 🔌 Check [API Documentation](API.md)
- 🐛 Create an issue on GitHub
- 💬 Contact support

## Development Commands

```bash
# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database (drop all data and reseed)
npm run db:migrate && npm run db:seed
```

## Tips for Development

1. **Use Nodemon**: Development mode uses nodemon for auto-reload
2. **Check Logs**: Watch the terminal for errors
3. **Use PostgreSQL GUI**: pgAdmin or TablePlus for easier database management
4. **Browser DevTools**: Check console for AdminJS errors
5. **Postman**: Great for testing API endpoints

## Security Reminders

- ⚠️ Change default passwords before deploying
- ⚠️ Use strong, random JWT_SECRET and SESSION_SECRET
- ⚠️ Never commit `.env` file to git
- ⚠️ Use HTTPS in production

---

**Congratulations! You're all set up!** 🎉

Happy coding! If you run into issues, check the troubleshooting section in the main README.
