import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database.js';
import sequelize from './config/database.js';
import { adminJs, adminRouter } from './adminjs/index.js';
import authRoutes from './routes/authRoutes.js';
import { User, Setting } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware (must be first)
app.use(cors());

// AdminJS routes (BEFORE body-parser)
app.use(adminJs.options.rootPath, adminRouter);

// Body-parser middleware (AFTER AdminJS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'eCommerce Admin Dashboard API',
    version: '1.0.0',
    endpoints: {
      admin: `${req.protocol}://${req.get('host')}${adminJs.options.rootPath}`,
      api: `${req.protocol}://${req.get('host')}/api`,
      health: `${req.protocol}://${req.get('host')}/health`
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Seed default settings if they don't exist
const seedSettings = async () => {
  try {
    const settingsCount = await Setting.count();
    
    if (settingsCount === 0) {
      console.log('📝 Seeding default settings...');
      
      const defaultSettings = [
        { key: 'GLOBAL_TAX_RATE', value: '0.10', description: 'Global tax rate (10%)' },
        { key: 'SHIPPING_COST', value: '5.00', description: 'Standard shipping cost' },
        { key: 'FREE_SHIPPING_MINIMUM', value: '50.00', description: 'Minimum order for free shipping' },
        { key: 'CURRENCY', value: 'USD', description: 'Default currency' },
        { key: 'SITE_NAME', value: 'eCommerce Dashboard', description: 'Site name' },
        { key: 'SUPPORT_EMAIL', value: 'support@example.com', description: 'Support email address' },
        { key: 'LOW_STOCK_THRESHOLD', value: '10', description: 'Low stock alert threshold' },
        { key: 'ORDER_PREFIX', value: 'ORD', description: 'Order number prefix' }
      ];

      await Setting.bulkCreate(defaultSettings);
      console.log('✅ Default settings seeded');
    } else {
      console.log('ℹ️  Settings already exist');
    }
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
  }
};

// Create admin user if doesn't exist
const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: adminPassword, // Will be hashed by beforeCreate hook
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Sync database - Create tables if they don't exist
    // In production, this will create tables on first deployment
    console.log('🔄 Synchronizing database schema...');
    await sequelize.sync({ alter: false }); // Creates tables if missing, doesn't drop existing
    console.log('✅ Database synchronized\n');

    // Seed default settings
    await seedSettings();

    // Create admin user if it doesn't exist
    await createAdminUser();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📊 AdminJS is available at http://localhost:${PORT}${adminJs.options.rootPath}`);
      console.log(`🔌 API is available at http://localhost:${PORT}/api`);
      console.log(`💚 Health check at http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

startServer();
