import 'dotenv/config';
import { User } from '../models/index.js';
import sequelize from '../config/database.js';

async function createAdmin() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user (password will be hashed by beforeCreate hook)
    const admin = await User.create({
      name: 'Administrator',
      email: adminEmail,
      password: adminPassword, // Don't hash here - let the model hook do it
      role: 'admin',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
