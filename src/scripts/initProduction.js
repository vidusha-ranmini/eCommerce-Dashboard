import 'dotenv/config';
import sequelize from '../config/database.js';
import { testConnection } from '../config/database.js';
import { User, Category, Product, Order, OrderItem, Setting } from '../models/index.js';

async function initProduction() {
  try {
    console.log('🚀 Initializing Production Database...\n');

    // Test connection
    console.log('1️⃣  Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    console.log('✅ Database connected\n');

    // Sync database (create tables)
    console.log('2️⃣  Creating database tables...');
    await sequelize.sync({ force: false }); // Don't drop existing tables
    console.log('✅ Tables created\n');

    // Seed Settings
    console.log('3️⃣  Checking settings...');
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
      console.log('✅ Settings seeded');
    } else {
      console.log('ℹ️  Settings already exist');
    }
    console.log('');

    // Create Admin User
    console.log('4️⃣  Checking admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      console.log('👤 Creating admin user...');
      await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('ℹ️  Admin user already exists');
      console.log(`   Email: ${existingAdmin.email}`);
    }
    console.log('');

    // Summary
    console.log('📊 Database Status:');
    const userCount = await User.count();
    const categoryCount = await Category.count();
    const productCount = await Product.count();
    const orderCount = await Order.count();
    const settingCount = await Setting.count();

    console.log(`   Users: ${userCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Orders: ${orderCount}`);
    console.log(`   Settings: ${settingCount}`);
    console.log('');

    console.log('✅ Production initialization complete!');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log(`   URL: https://your-app.railway.app/admin`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('');
    console.log('⚠️  Remember to change the admin password after first login!');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

initProduction();
