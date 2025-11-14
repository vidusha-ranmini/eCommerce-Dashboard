import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize, testConnection } from './config/database.js';
import { adminJs, adminRouter } from './adminjs/index.js';
import authRoutes from './routes/authRoutes.js';

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

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Syncing database...');
      await sequelize.sync({ alter: false }); // Sync without dropping tables
      console.log('✅ Database synchronized\n');
    }

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
