import 'dotenv/config';
import { User } from '../models/index.js';
import sequelize from '../config/database.js';

async function fixAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Find admin user
    const admin = await User.findOne({
      where: { email: adminEmail }
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log(`   Looking for: ${adminEmail}`);
      console.log('\nCreating new admin user...');
      
      const newAdmin = await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: adminPassword, // Will be hashed by beforeCreate hook
        role: 'admin',
        isActive: true
      });

      console.log('✅ Admin user created successfully!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('✅ Admin user found!');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Current role: ${admin.role}`);
      
      console.log('\n🔄 Resetting password...');
      
      // Update password (will be hashed by beforeUpdate hook)
      admin.password = adminPassword;
      await admin.save();
      
      console.log('✅ Password reset successfully!');
      console.log(`   New password: ${adminPassword}`);
      console.log('\n⚠️  IMPORTANT: Use these credentials to login:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAdminPassword();
