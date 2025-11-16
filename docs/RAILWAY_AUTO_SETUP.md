# 🚂 Railway Deployment - Database Auto-Setup Guide

## ✅ What's New

Your app now **automatically creates database tables and admin user** on first startup! No manual database setup needed.

## 📋 What Happens on First Deployment

When you deploy to Railway, the app will automatically:

1. ✅ Connect to PostgreSQL database
2. ✅ Create all tables (users, products, orders, categories, settings, order_items)
3. ✅ Seed default settings (tax rate, shipping cost, etc.)
4. ✅ Create admin user using your `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
5. ✅ Start the server and be ready to use!

**You don't need to run any manual database commands!**

---

## 🚀 Railway Deployment Steps

### 1. Create PostgreSQL Service
- In Railway, click **"+ New"** → **"Database"** → **"PostgreSQL"**
- Wait for it to provision (takes ~30 seconds)

### 2. Create Web Service
- Click **"+ New"** → **"GitHub Repo"** → Select your `eCommerce-Dashboard` repo
- Or **"Empty Service"** and deploy via CLI

### 3. Set Environment Variables

In your **Web Service** → **Variables** tab, add these:

```bash
# Database (REQUIRED - references Postgres service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Environment
NODE_ENV=production
PORT=3000

# Admin Account (CHANGE THESE!)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# Security Secrets (GENERATE NEW ONES!)
JWT_SECRET=your_generated_secret_min_32_chars
SESSION_SECRET=your_generated_secret_min_32_chars
JWT_EXPIRES_IN=24h
```

**⚠️ Important:**
- `DATABASE_URL` must use `${{Postgres.DATABASE_URL}}` (with double braces)
- Change `ADMIN_PASSWORD` to something secure
- Generate new secrets (see below)

### 4. Generate Secrets

Run locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run twice - use first for JWT_SECRET, second for SESSION_SECRET

### 5. Deploy

- Push to GitHub (if using GitHub integration)
- Or use Railway CLI: `railway up`

### 6. Watch Deployment Logs

In Railway **Deployments** tab, you should see:

```
[dotenv] injecting env...
🔍 Environment Debug Info:
NODE_ENV: production
DATABASE_URL exists: true
🔗 Connecting to database: postgresql://...
✅ Database connection established

🔄 Synchronizing database schema...
Executing (default): CREATE TABLE IF NOT EXISTS "users"...
Executing (default): CREATE TABLE IF NOT EXISTS "categories"...
Executing (default): CREATE TABLE IF NOT EXISTS "products"...
Executing (default): CREATE TABLE IF NOT EXISTS "orders"...
Executing (default): CREATE TABLE IF NOT EXISTS "order_items"...
Executing (default): CREATE TABLE IF NOT EXISTS "settings"...
✅ Database synchronized

📝 Seeding default settings...
✅ Default settings seeded

✅ Admin user created
   Email: admin@yourdomain.com
   Password: YourSecurePassword123!

🚀 Server is running on port 3000
📊 AdminJS is available at http://localhost:3000/admin
```

### 7. Access Your App

1. Railway will give you a URL like: `https://ecommerce-dashboard-production-xxxx.up.railway.app`
2. Go to: `https://your-url.railway.app/admin`
3. Login with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to database"

**Check:**
```bash
# In Railway Web Service variables:
DATABASE_URL=${{Postgres.DATABASE_URL}}  ✅ Correct
DATABASE_URL=${Postgres.DATABASE_URL}   ❌ Wrong (single braces)
DATABASE_URL=$DATABASE_URL              ❌ Wrong (no reference)
```

**Fix:** Make sure you're using `${{Postgres.DATABASE_URL}}` with double curly braces.

### Problem: "Invalid credentials" when logging in

**Solution 1 - Check environment variables:**
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in Railway
- Make sure no extra spaces or quotes
- Try simple password first (e.g., "Admin123!")

**Solution 2 - Reset password:**
```bash
# Using Railway CLI
railway run npm run admin:reset
```

**Solution 3 - Check deployment logs:**
Look for the line that says:
```
✅ Admin user created
   Email: your-email@example.com
   Password: your-password
```

Use EXACTLY those credentials to login.

### Problem: "Relation 'users' does not exist" or similar

**This means tables weren't created. Check:**

1. **Deployment logs** - Look for "Database synchronized" message
2. **If tables weren't created**, manually run:
   ```bash
   railway run npm run db:init
   ```
3. **Check DATABASE_URL** is properly set

### Problem: App crashes on startup

**Common causes:**

1. **Missing DATABASE_URL**
   - Must be set in Web Service variables
   - Must reference Postgres service: `${{Postgres.DATABASE_URL}}`

2. **Postgres service not running**
   - Check Postgres service status in Railway
   - Restart if needed

3. **Missing environment variables**
   - Verify all required vars are set (see Step 3)

---

## 📊 Verify Database Tables

After deployment, you can verify tables were created:

**Option 1 - Railway CLI:**
```bash
# Connect to your Railway environment
railway link

# Run query
railway run -- psql $DATABASE_URL -c "\dt"
```

**Option 2 - Check via app:**
```bash
railway logs
```

Look for these lines in logs:
```
✅ Database synchronized
📝 Seeding default settings...
✅ Default settings seeded
✅ Admin user created
```

---

## 🎯 Success Checklist

After deployment, verify:

- [ ] PostgreSQL service is running (green)
- [ ] Web service deployed successfully (green)
- [ ] Deployment logs show "Database synchronized"
- [ ] Deployment logs show "Admin user created"
- [ ] Can access `/admin` URL
- [ ] Can login with ADMIN_EMAIL and ADMIN_PASSWORD
- [ ] Dashboard loads without errors
- [ ] Can view Users, Products, Orders, etc.

---

## 🔧 Manual Database Initialization (If Needed)

If automatic initialization fails, you can manually run:

```bash
# Connect Railway CLI to your project
railway link

# Run database initialization script
railway run npm run db:init
```

This will:
- Create all tables
- Seed settings
- Create admin user
- Show you the database status

---

## 📞 Still Having Issues?

1. **Check Railway deployment logs** for error messages
2. **Verify environment variables** are set correctly
3. **Check PostgreSQL service** is running
4. **Try manual init:** `railway run npm run db:init`
5. **Reset admin password:** `railway run npm run admin:reset`

---

## 🎉 What You Get

Once deployed, you'll have:

- ✅ Full eCommerce admin dashboard
- ✅ Role-based access control (Admin & User roles)
- ✅ Product management
- ✅ Order tracking
- ✅ User management
- ✅ Dynamic settings (tax, shipping, etc.)
- ✅ Custom role-specific dashboards
- ✅ PostgreSQL database with all tables
- ✅ Secure authentication (JWT + bcrypt)
- ✅ RESTful API endpoints

**All automatically set up and ready to use!** 🚀
