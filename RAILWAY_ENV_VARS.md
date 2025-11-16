## Railway Environment Variables - Quick Reference

Copy and paste these into your Railway Web Service → Variables tab:

### 🔗 Database Connection
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 🔐 Admin Account (⚠️ CHANGE FOR PRODUCTION!)
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeThisSecurePassword123!
```

### 🔑 Security Secrets (⚠️ GENERATE NEW ONES!)
```
JWT_SECRET=REPLACE_WITH_RANDOM_32_CHAR_STRING
SESSION_SECRET=REPLACE_WITH_RANDOM_32_CHAR_STRING
JWT_EXPIRES_IN=24h
```

### 🌍 Environment
```
NODE_ENV=production
PORT=3000
```

---

## 🔧 Generate Strong Secrets

Run locally to generate secrets:

**Option 1 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 2 - Using openssl (Linux/Mac):**
```bash
openssl rand -base64 32
```

**Option 3 - Online Generator:**
https://www.random.org/strings/

**Settings:** Length: 32, Quantity: 2, Characters: Alphanumeric

---

## ⚠️ Security Checklist

Before going to production:

- [ ] Changed `ADMIN_PASSWORD` from default
- [ ] Generated new `JWT_SECRET` (32+ characters)
- [ ] Generated new `SESSION_SECRET` (32+ characters)
- [ ] Used strong `ADMIN_PASSWORD` (mix of letters, numbers, symbols)
- [ ] Verified `DATABASE_URL` references `${{Postgres.DATABASE_URL}}`
- [ ] Set `NODE_ENV=production`
- [ ] Never committed `.env` file to Git

---

## 📝 Variable Reference Format

**When referencing Railway Postgres service variables:**

✅ **CORRECT:**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

❌ **INCORRECT:**
```
DATABASE_URL=${Postgres.DATABASE_URL}      # Single braces won't work
DATABASE_URL=$DATABASE_URL                 # Won't reference service
DATABASE_URL=postgres://...                # Hardcoding breaks on restart
```

**Note:** `Postgres` is the name of your PostgreSQL service in Railway. If you named it differently, use that name instead.

---

## 🚀 Quick Deploy Checklist

1. **PostgreSQL Service:** ✅ Running
2. **Web Service Variables:** ✅ All set (see above)
3. **GitHub Connected:** ✅ Repo linked
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Deploy:** Push to main branch
7. **Auto-Setup:** App will automatically:
   - Create all database tables
   - Seed default settings
   - Create admin user
   - Be ready to use!

**Note:** First deployment takes 2-3 minutes for database setup.

---

## 🐛 Troubleshooting

**"No tables in database":**
- Don't worry! App auto-creates tables on startup
- Check deployment logs for "Database synchronized"
- Or manually run: `railway run npm run db:init`

**"Invalid credentials" after deploy:**
```bash
railway run npm run admin:reset
```

**"Cannot connect to database":**
- Check: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- Verify PostgreSQL service is running

**"JWT_SECRET not set" or similar:**
- Add all variables listed above
- Redeploy after adding variables

---

## 📖 Full Documentation

- **Complete Deployment Guide:** `docs/RAILWAY_DEPLOYMENT.md`
- **Admin Fix Guide:** `docs/ADMIN_LOGIN_FIX.md`
- **Main README:** `README.md`
