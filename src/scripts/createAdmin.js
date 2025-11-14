import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import { sequelize } from '../config/database.js';

async function createAdmin() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
