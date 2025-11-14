import 'dotenv/config';
import { sequelize, testConnection } from '../config/database.js';

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...\n');

    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Sync all models
    console.log('📦 Syncing database models...');
    await sequelize.sync({ force: false, alter: true });
    
    console.log('\n✅ Database migration completed successfully!');
    console.log('📝 All tables have been created/updated.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

migrate();
