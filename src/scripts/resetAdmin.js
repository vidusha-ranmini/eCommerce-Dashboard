import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { sequelize } from '../config/database.js';

async function resetAdmin() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.\n');

    // Delete existing admin user
    const deleted = await User.destroy({
      where: { email: 'admin@example.com' }
    });

    console.log(`Deleted ${deleted} user(s) with email admin@example.com\n`);

    // Hash the password BEFORE creating user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Password hashed successfully');
    console.log('Hash starts with:', hashedPassword.substring(0, 7));
    console.log('Hash length:', hashedPassword.length);
    console.log('');

    // Create admin user with pre-hashed password
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword, // Already hashed
      role: 'admin',
      isActive: true
    }, {
      hooks: false // Skip hooks since we already hashed it
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('');

    // Verify the password
    const savedUser = await User.findOne({
      where: { email: 'admin@example.com' },
      attributes: ['id', 'name', 'email', 'password', 'role', 'isActive']
    });

    console.log('=== VERIFICATION ===');
    console.log('Saved password hash:', savedUser.password);
    console.log('Hash length:', savedUser.password.length);
    console.log('Starts with $2b$:', savedUser.password.startsWith('$2b$'));
    
    // Test password validation
    const isValid = await bcrypt.compare('admin123', savedUser.password);
    console.log('Password validation test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAdmin();
