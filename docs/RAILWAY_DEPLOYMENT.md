# Railway Deployment Guide

## 🚂 Deploy to Railway with PostgreSQL

### Step 1: Create Railway Project

1. Go to [Railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy PostgreSQL"** first

### Step 2: Configure PostgreSQL Service

1. After PostgreSQL is created, click on it
2. Go to **"Variables"** tab
3. Note that Railway auto-creates these variables:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
   - `DATABASE_URL` (full connection string)

### Step 3: Add Your Application

1. Click **"+ New"** in your Railway project
2. Select **"GitHub Repo"** or **"Empty Service"**
3. If using GitHub:
   - Connect your repository
   - Select the `eCommerce-Dashboard` repo
4. If using Empty Service:
   - Deploy from CLI (see below)

### Step 4: Configure Application Environment Variables

Click on your web service → **"Variables"** tab → Add these variables:

#### Required Variables:
```bash
# Server
PORT=3000
NODE_ENV=production

# Database - Reference the PostgreSQL service
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Or use individual variables (DATABASE_URL is preferred):
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# JWT Configuration (Generate strong secrets!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars_make_it_very_long
JWT_EXPIRES_IN=24h

# Session Configuration (Generate strong secrets!)
SESSION_SECRET=your_super_secret_session_key_change_this_in_production_min_32_chars_make_it_very_long

# Admin Configuration (IMPORTANT!)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

#### ⚠️ IMPORTANT Security Notes:

1. **Change JWT_SECRET**: Generate a strong random string (at least 32 characters)
   ```bash
   # Generate on Linux/Mac:
   openssl rand -base64 32
   
   # Or in Node.js:
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Change SESSION_SECRET**: Use a different strong random string

3. **Change ADMIN_PASSWORD**: Use a strong, unique password for production

### Step 5: Configure Service Settings

1. In your web service, go to **"Settings"** tab
2. Set **"Start Command"**: `npm start`
3. Set **"Build Command"**: `npm install`
4. **Root Directory**: Leave empty (or `/` if needed)

### Step 6: Deploy

1. Railway will automatically deploy after you push to GitHub
2. Watch the deployment logs in the **"Deployments"** tab
3. Once deployed, Railway will provide a public URL

### Step 7: Verify Deployment

1. Click the generated URL (e.g., `https://your-app.railway.app`)
2. Add `/admin` to access AdminJS (e.g., `https://your-app.railway.app/admin`)
3. Login with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials" on login

**Solution 1: Run the password reset script on Railway**

Using Railway CLI:
```bash
railway run npm run admin:reset
```

Or connect to your Railway service and run:
```bash
node src/scripts/fixAdminPassword.js
```

**Solution 2: Verify environment variables**
- Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly in Railway
- Check that there are no extra spaces or quotes
- Verify the values match what you're using to login

### Issue: "Cannot connect to database"

**Check these:**
1. Ensure `DATABASE_URL` variable references PostgreSQL service: `${{Postgres.DATABASE_URL}}`
2. PostgreSQL service must be running
3. Check PostgreSQL service logs for errors

### Issue: "searchParams undefined" or "DATABASE_URL undefined"

**Solution:**
- In your **Web Service** variables, you must reference the Postgres service
- Use: `${{Postgres.DATABASE_URL}}` (with double curly braces)
- NOT just `$DATABASE_URL` or `${DATABASE_URL}`

### Issue: Server crashes on startup

**Check deployment logs for:**
- Missing dependencies: Run `npm install` in build command
- Database connection errors: Verify DATABASE_URL
- Port conflicts: Railway auto-assigns PORT (don't hardcode)

---

## 📝 Railway CLI Deployment (Alternative)

### Install Railway CLI:
```bash
npm i -g @railway/cli
```

### Login:
```bash
railway login
```

### Link to project:
```bash
railway link
```

### Set environment variables:
```bash
railway variables set NODE_ENV=production
railway variables set ADMIN_EMAIL=admin@example.com
railway variables set ADMIN_PASSWORD=YourSecurePassword123!
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set SESSION_SECRET=$(openssl rand -base64 32)
```

### Deploy:
```bash
railway up
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** to Git (already in `.gitignore`)
2. **Use strong passwords** for admin account
3. **Rotate secrets regularly** (JWT_SECRET, SESSION_SECRET)
4. **Enable 2FA** on Railway account
5. **Use HTTPS only** (Railway provides this automatically)
6. **Monitor logs** regularly for suspicious activity
7. **Limit admin access** - create regular user accounts for daily operations

---

## 📊 Post-Deployment Checklist

- [ ] PostgreSQL service is running
- [ ] Web service deployed successfully
- [ ] Environment variables are set correctly
- [ ] DATABASE_URL references Postgres service
- [ ] ADMIN_EMAIL and ADMIN_PASSWORD are set
- [ ] JWT_SECRET and SESSION_SECRET are strong and unique
- [ ] Can access `/admin` endpoint
- [ ] Can login with admin credentials
- [ ] Dashboard loads correctly
- [ ] Can create/edit resources (users, products, etc.)
- [ ] Regular users have appropriate access restrictions

---

## 🆘 Still Having Issues?

### Check Application Logs:
```bash
railway logs
```

### Connect to Railway Shell:
```bash
railway run bash
```

### Test Database Connection:
```bash
railway run node -e "import('./src/config/database.js').then(m => m.testConnection())"
```

### Reset Admin Password Manually:
```bash
railway run npm run admin:reset
```

---

## 🔄 Updates and Redeployments

Railway auto-deploys on every push to your connected branch. To manually redeploy:

1. Go to **"Deployments"** tab
2. Click **"Deploy"** button on latest deployment
3. Or push a new commit to trigger deployment

---

## 📞 Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [AdminJS Documentation](https://docs.adminjs.co/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Project Repository Issues](https://github.com/your-repo/issues)
