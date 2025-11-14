import 'dotenv/config';
import { sequelize, testConnection } from '../config/database.js';
import { User, Category, Product, Order, OrderItem, Setting } from '../models/index.js';

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Clear existing data (optional - be careful in production!)
    if (process.env.NODE_ENV === 'development') {
      console.log('🗑️  Clearing existing data...');
      await OrderItem.destroy({ where: {}, truncate: true, cascade: true });
      await Order.destroy({ where: {}, truncate: true, cascade: true });
      await Product.destroy({ where: {}, truncate: true, cascade: true });
      await Category.destroy({ where: {}, truncate: true, cascade: true });
      await User.destroy({ where: {}, truncate: true, cascade: true });
      await Setting.destroy({ where: {}, truncate: true, cascade: true });
    }

    // Create users
    console.log('👥 Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isActive: true
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      isActive: true
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'user123',
      role: 'user',
      isActive: true
    });

    console.log(`✅ Created ${3} users`);

    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Category.bulkCreate([
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        isActive: true
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing',
        isActive: true
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
        slug: 'books',
        isActive: true
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and gardening',
        slug: 'home-garden',
        isActive: true
      }
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create products
    console.log('📦 Creating products...');
    const products = await Product.bulkCreate([
      {
        name: 'Laptop Pro 15',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        stock: 50,
        sku: 'LAP-PRO-15',
        imageUrl: 'https://via.placeholder.com/300x300?text=Laptop',
        categoryId: categories[0].id,
        isActive: true
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        price: 29.99,
        stock: 200,
        sku: 'MOUSE-WRL-01',
        imageUrl: 'https://via.placeholder.com/300x300?text=Mouse',
        categoryId: categories[0].id,
        isActive: true
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        stock: 150,
        sku: 'TSHIRT-COT-BLU',
        imageUrl: 'https://via.placeholder.com/300x300?text=T-Shirt',
        categoryId: categories[1].id,
        isActive: true
      },
      {
        name: 'Jeans Classic Fit',
        description: 'Classic fit denim jeans',
        price: 49.99,
        stock: 100,
        sku: 'JEANS-CLF-BLU',
        imageUrl: 'https://via.placeholder.com/300x300?text=Jeans',
        categoryId: categories[1].id,
        isActive: true
      },
      {
        name: 'JavaScript: The Good Parts',
        description: 'Essential JavaScript programming guide',
        price: 24.99,
        stock: 75,
        sku: 'BOOK-JS-GD',
        imageUrl: 'https://via.placeholder.com/300x300?text=JS+Book',
        categoryId: categories[2].id,
        isActive: true
      },
      {
        name: 'Garden Tool Set',
        description: 'Complete set of gardening tools',
        price: 79.99,
        stock: 40,
        sku: 'GARDEN-TOOL-SET',
        imageUrl: 'https://via.placeholder.com/300x300?text=Garden+Tools',
        categoryId: categories[3].id,
        isActive: true
      }
    ]);

    console.log(`✅ Created ${products.length} products`);

    // Create orders
    console.log('🛒 Creating orders...');
    const order1 = await Order.create({
      userId: user1.id,
      totalAmount: 1349.98,
      status: 'delivered',
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      notes: 'Please deliver before 5 PM'
    });

    const order2 = await Order.create({
      userId: user2.id,
      totalAmount: 69.98,
      status: 'processing',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      paymentMethod: 'PayPal',
      paymentStatus: 'paid'
    });

    const order3 = await Order.create({
      userId: user1.id,
      totalAmount: 24.99,
      status: 'pending',
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card',
      paymentStatus: 'pending'
    });

    console.log(`✅ Created ${3} orders`);

    // Create order items
    console.log('📋 Creating order items...');
    await OrderItem.bulkCreate([
      {
        orderId: order1.id,
        productId: products[0].id,
        quantity: 1,
        price: 1299.99
      },
      {
        orderId: order1.id,
        productId: products[1].id,
        quantity: 1,
        price: 29.99
      },
      {
        orderId: order2.id,
        productId: products[2].id,
        quantity: 1,
        price: 19.99
      },
      {
        orderId: order2.id,
        productId: products[3].id,
        quantity: 1,
        price: 49.99
      },
      {
        orderId: order3.id,
        productId: products[4].id,
        quantity: 1,
        price: 24.99
      }
    ]);

    console.log('✅ Created order items');

    // Create settings
    console.log('⚙️  Creating settings...');
    await Setting.bulkCreate([
      {
        key: 'site_name',
        value: 'eCommerce Store',
        description: 'The name of the eCommerce site',
        type: 'string'
      },
      {
        key: 'tax_rate',
        value: '0.08',
        description: 'Tax rate for orders (as decimal)',
        type: 'number'
      },
      {
        key: 'free_shipping_threshold',
        value: '50.00',
        description: 'Minimum order amount for free shipping',
        type: 'number'
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        description: 'Enable or disable maintenance mode',
        type: 'boolean'
      },
      {
        key: 'contact_info',
        value: JSON.stringify({
          email: 'support@ecommerce.com',
          phone: '+1-234-567-8900',
          address: '123 Business St, City, State 12345'
        }),
        description: 'Store contact information',
        type: 'json'
      }
    ]);

    console.log('✅ Created settings');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: 3 (1 admin, 2 regular users)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Orders: 3`);
    console.log(`   - Order Items: 5`);
    console.log(`   - Settings: 5`);
    console.log('\n🔑 Admin credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n👤 User credentials:');
    console.log(`   Email: john@example.com / jane@example.com`);
    console.log(`   Password: user123\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seed();
