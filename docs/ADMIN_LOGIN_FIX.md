# 🔧 Admin Login Fix - Summary

## Problem
When deployed to Railway, admin login shows "Invalid credentials" even though the same credentials work locally.

## Root Cause
The issue was caused by **double password hashing**:
1. The `createAdmin.js` script was manually hashing passwords with `bcrypt.hash()`
2. Then the User model's `beforeCreate` hook was hashing it AGAIN
3. Result: Password stored as hash(hash(password)) instead of hash(password)
4. Login comparison failed because it compared input password hash with double-hashed stored password

## Solution Applied

### 1. Fixed `createAdmin.js` Script
- ✅ Removed manual `bcrypt.hash()` call
- ✅ Now uses `bcryptjs` (consistent with User model)
- ✅ Reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables
- ✅ Lets the User model's `beforeCreate` hook handle hashing

### 2. Added Automatic Admin Creation
- ✅ Server now creates admin user on startup if it doesn't exist
- ✅ Added `createAdminUser()` function in `server.js`
- ✅ Runs after database sync but before server starts listening

### 3. Created Password Reset Script
- ✅ New script: `src/scripts/fixAdminPassword.js`
- ✅ Finds admin user and resets password
- ✅ Can create admin if doesn't exist
- ✅ Properly uses model hooks for hashing

### 4. Added npm Scripts
```json
"admin:create": "node src/scripts/createAdmin.js",
"admin:reset": "node src/scripts/fixAdminPassword.js"
```

### 5. Created Comprehensive Deployment Guide
- ✅ Railway deployment instructions: `docs/RAILWAY_DEPLOYMENT.md`
- ✅ Environment variable setup guide
- ✅ Security best practices
- ✅ Troubleshooting section
- ✅ Post-deployment checklist

## How to Fix on Railway

### Option 1: Redeploy (Fresh Start)
1. Set environment variables in Railway (Web Service):
   ```
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=YourSecurePassword123!
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<generate-strong-secret>
   SESSION_SECRET=<generate-strong-secret>
   NODE_ENV=production
   ```
2. Redeploy the application
3. Server will automatically create admin user on startup

### Option 2: Run Reset Script (Existing Deployment)
If you already have a deployment with incorrect password:

Using Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run the reset script
railway run npm run admin:reset
```

Or using Railway Dashboard:
1. Go to your service → "Settings" → "General"
2. Add a temporary "One-off Command"
3. Command: `npm run admin:reset`
4. Run it

## Environment Variables for Railway

**Required in Web Service:**
```bash
# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Admin Credentials (IMPORTANT!)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourVerySecurePassword123!

# Secrets (Generate strong random strings!)
JWT_SECRET=<32+ char random string>
SESSION_SECRET=<32+ char random string>

# Environment
NODE_ENV=production
PORT=3000
```

### Generate Secrets:
```bash
# Using openssl:
openssl rand -base64 32

# Using Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Testing Locally

Test the fix locally:

```bash
# Reset admin password
npm run admin:reset

# Start server
npm run dev

# Login at http://localhost:3000/admin
# Email: admin@example.com
# Password: admin123
```

## Verification Checklist

After deploying to Railway:

- [ ] PostgreSQL service is running
- [ ] `DATABASE_URL` in Web Service references `${{Postgres.DATABASE_URL}}`
- [ ] `ADMIN_EMAIL` is set (no spaces, valid email)
- [ ] `ADMIN_PASSWORD` is set (strong password for production!)
- [ ] `JWT_SECRET` and `SESSION_SECRET` are set (strong random strings)
- [ ] Application deployed successfully (check logs)
- [ ] Can access `/admin` endpoint
- [ ] Can login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`

## Additional Files Created

1. `src/scripts/fixAdminPassword.js` - Password reset script
2. `docs/RAILWAY_DEPLOYMENT.md` - Complete deployment guide
3. Updated `package.json` with new scripts
4. Updated `server.js` with auto admin creation
5. Fixed `src/scripts/createAdmin.js` to prevent double hashing

## Security Notes

⚠️ **IMPORTANT for Production:**

1. **Never use default passwords** in production
2. **Generate strong secrets** for JWT and Session
3. **Use environment variables** - never hardcode credentials
4. **Rotate secrets regularly**
5. **Enable 2FA** on Railway account
6. **Monitor logs** for suspicious activity
7. **Use HTTPS only** (Railway provides automatically)

## Quick Reference Commands

```bash
# Local Development
npm run dev                 # Start dev server
npm run admin:create        # Create admin user
npm run admin:reset         # Reset admin password

# Railway Deployment
railway login              # Login to Railway
railway link               # Link to project
railway run npm run admin:reset  # Reset admin on Railway
railway logs               # View logs
```

## Support Resources

- **Deployment Guide**: `docs/RAILWAY_DEPLOYMENT.md`
- **Railway Docs**: https://docs.railway.app/
- **AdminJS Docs**: https://docs.adminjs.co/
- **Sequelize Docs**: https://sequelize.org/docs/v6/

---

**Last Updated**: November 16, 2025
**Status**: ✅ Fixed and Tested
