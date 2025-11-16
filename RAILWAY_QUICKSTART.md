# 🚀 Railway Quick Start

## 1️⃣ Set These Environment Variables

In Railway Web Service → Variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
ADMIN_EMAIL=youremail@example.com
ADMIN_PASSWORD=YourSecurePassword123
JWT_SECRET=<generate-random-32-chars>
SESSION_SECRET=<generate-random-32-chars>
NODE_ENV=production
```

## 2️⃣ Deploy

Push to GitHub or run: `railway up`

## 3️⃣ Wait for Auto-Setup

App will automatically:
- ✅ Create all database tables
- ✅ Seed settings
- ✅ Create admin user

Watch logs for: "✅ Database synchronized"

## 4️⃣ Login

Go to: `https://your-app.railway.app/admin`

Use your ADMIN_EMAIL and ADMIN_PASSWORD

---

## 🆘 If Login Fails

```bash
railway run npm run admin:reset
```

## 📚 Full Guide

See: `docs/RAILWAY_AUTO_SETUP.md`
