# Deployment Guide

This guide covers deploying the eCommerce Admin Dashboard to various platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Deployment Platforms](#deployment-platforms)
   - [Heroku](#heroku)
   - [Railway](#railway)
   - [DigitalOcean](#digitalocean)
   - [AWS](#aws)
5. [Production Considerations](#production-considerations)
6. [Monitoring](#monitoring)

## Prerequisites

Before deploying, ensure you have:

- A PostgreSQL database (managed service recommended)
- Node.js 14+ runtime environment
- Git repository (GitHub/GitLab/Bitbucket)
- SSL certificate for HTTPS (provided by most platforms)

## Environment Variables

Set these environment variables in your production environment:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_secure_password

# JWT Configuration (IMPORTANT: Use strong random values)
JWT_SECRET=your-super-secure-random-jwt-secret
JWT_EXPIRES_IN=24h

# Session Configuration (IMPORTANT: Use strong random values)
SESSION_SECRET=your-super-secure-random-session-secret

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
```

⚠️ **Security Note**: Never commit `.env` files to version control. Use your platform's environment variable management.

## Database Setup

### 1. Provision PostgreSQL Database

Most platforms offer managed PostgreSQL:
- **Heroku**: Heroku Postgres add-on
- **Railway**: Built-in PostgreSQL
- **DigitalOcean**: Managed Databases
- **AWS**: RDS PostgreSQL

### 2. Connection String Format

```
postgresql://username:password@host:port/database?sslmode=require
```

### 3. SSL Connection

For production, always use SSL:

```javascript
// In database.js for production
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

## Deployment Platforms

### Heroku

#### Step 1: Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### Step 2: Create Heroku App

```bash
heroku create your-app-name
```

#### Step 3: Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

#### Step 4: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set SESSION_SECRET=your-secret
heroku config:set ADMIN_EMAIL=admin@example.com
heroku config:set ADMIN_PASSWORD=your-password
```

#### Step 5: Deploy

```bash
git push heroku main
```

#### Step 6: Run Migrations

```bash
heroku run npm run db:migrate
heroku run npm run db:seed
```

#### Step 7: Open App

```bash
heroku open
```

---

### Railway

#### Step 1: Connect Repository

1. Go to [Railway](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

#### Step 2: Add PostgreSQL

1. Click "New" → "Database" → "PostgreSQL"
2. Railway will automatically create DATABASE_URL

#### Step 3: Configure Environment Variables

In Railway dashboard, add:
- `NODE_ENV=production`
- `JWT_SECRET`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

#### Step 4: Deploy

Railway deploys automatically on push to main branch.

#### Step 5: Run Migrations

Use Railway's CLI or dashboard to run:
```bash
npm run db:migrate
npm run db:seed
```

---

### DigitalOcean

#### Step 1: Create Droplet

1. Create a Droplet (Ubuntu 22.04 recommended)
2. Choose appropriate size (minimum: 1GB RAM)

#### Step 2: SSH into Droplet

```bash
ssh root@your-droplet-ip
```

#### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
npm install -g pm2
```

#### Step 4: Setup PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE ecommerce_db;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO your_user;
\q
```

#### Step 5: Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/yourusername/eCommerce-Dashboard.git
cd eCommerce-Dashboard

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Run migrations
npm run db:migrate
npm run db:seed
```

#### Step 6: Start with PM2

```bash
pm2 start src/server.js --name ecommerce-admin
pm2 save
pm2 startup
```

#### Step 7: Setup Nginx (Optional but recommended)

```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/ecommerce-admin
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/ecommerce-admin /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 8: Setup SSL with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

### AWS (Elastic Beanstalk)

#### Step 1: Install EB CLI

```bash
pip install awsebcli
```

#### Step 2: Initialize EB

```bash
eb init -p node.js ecommerce-admin
```

#### Step 3: Create Environment

```bash
eb create ecommerce-admin-env
```

#### Step 4: Set Environment Variables

```bash
eb setenv NODE_ENV=production JWT_SECRET=xxx SESSION_SECRET=xxx
```

#### Step 5: Deploy

```bash
eb deploy
```

#### Step 6: Setup RDS PostgreSQL

1. Go to AWS RDS Console
2. Create PostgreSQL instance
3. Get connection details
4. Update environment variables:

```bash
eb setenv DB_HOST=xxx DB_NAME=xxx DB_USER=xxx DB_PASSWORD=xxx
```

---

## Production Considerations

### 1. Security

```javascript
// Enable HTTPS only
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// Set security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 2. Database

- Use connection pooling
- Enable SSL connections
- Regular backups
- Monitor performance

### 3. Logging

```javascript
// Use a proper logging library
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 4. Performance

- Enable compression:
```javascript
const compression = require('compression');
app.use(compression());
```

- Use a CDN for static assets
- Implement caching where appropriate
- Optimize database queries

### 5. Monitoring

Consider using:
- **Sentry** for error tracking
- **New Relic** for APM
- **DataDog** for infrastructure monitoring
- **LogRocket** for session replay

### 6. Backup Strategy

- Automated daily database backups
- Store backups in multiple locations
- Test restore procedures regularly

### 7. Scaling

For high traffic:
- Use load balancers
- Horizontal scaling with multiple instances
- Database read replicas
- Caching layer (Redis)

## Health Checks

Implement health checks for monitoring:

```javascript
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'healthy',
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected'
    });
  }
});
```

## Rollback Strategy

Always have a rollback plan:

```bash
# Heroku
heroku releases
heroku rollback v123

# Railway/DigitalOcean
git revert HEAD
git push origin main
```

## Post-Deployment Checklist

- [ ] SSL certificate is active
- [ ] Environment variables are set correctly
- [ ] Database migrations ran successfully
- [ ] Health check endpoint responds
- [ ] Admin login works
- [ ] User login works
- [ ] All resources are accessible based on roles
- [ ] Logs are being collected
- [ ] Monitoring is active
- [ ] Backups are configured
- [ ] Error tracking is working

## Troubleshooting Production Issues

### Application Won't Start

1. Check logs: `heroku logs --tail` or `pm2 logs`
2. Verify environment variables
3. Check database connection
4. Verify Node.js version

### Database Connection Failed

1. Verify connection string
2. Check SSL requirements
3. Whitelist IP addresses
4. Test connection manually:
```bash
psql "postgresql://user:pass@host:port/db?sslmode=require"
```

### High Memory Usage

1. Check for memory leaks
2. Optimize database queries
3. Implement pagination
4. Scale vertically or horizontally

---

For additional support, refer to the platform-specific documentation or create an issue in the GitHub repository.
