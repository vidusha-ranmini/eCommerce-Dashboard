import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// ----------------------------------------------------------------------
// 🚨 FIX: Only run dotenv.config() in the local development environment
// ----------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Build database URL with fallback to individual variables
let databaseUrl;

// In Railway, process.env.DATABASE_URL will contain the correct, 
// referenced internal connection string if the variable is set.
if (process.env.DATABASE_URL) {
  // Railway provides DATABASE_URL
  databaseUrl = process.env.DATABASE_URL;
} else {
  // This fallback block will ONLY run in local development 
  // where the variables are defined in the local .env file.
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbName = process.env.DB_NAME || 'ecommercedb';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '1234';

  databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

// Validate DATABASE_URL before passing to Sequelize
if (!databaseUrl || databaseUrl === 'undefined') {
  console.error('❌ DATABASE_URL is not defined!');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DB') || k.includes('DATABASE')));
  throw new Error('DATABASE_URL is required but not defined');
}

console.log('🔗 Connecting to database:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Hide password in logs

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  // Ensure logging is off in production
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  // Set SSL options for production (hosted environments like Railway)
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// ... rest of your code

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    console.error('Connection string (redacted):', databaseUrl.replace(/:[^:@]+@/, ':****@'));
    return false;
  }
};

export default sequelize;