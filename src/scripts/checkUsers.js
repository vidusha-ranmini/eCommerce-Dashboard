import { User } from '../models/index.js';
import { sequelize } from '../config/database.js';

async function checkUsers() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.\n');

    // Get all users
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'password', 'role', 'isActive', 'createdAt', 'updatedAt'],
      raw: true
    });

    console.log('=== USERS TABLE DETAILS ===\n');
    console.log(`Total users found: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`User #${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password Hash: ${user.password}`);
      console.log(`  Password Hash Length: ${user.password ? user.password.length : 0}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Is Active: ${user.isActive}`);
      console.log(`  Created At: ${user.createdAt}`);
      console.log(`  Updated At: ${user.updatedAt}`);
      console.log('---\n');
    });

    // Check if admin@example.com exists
    const adminUser = await User.findOne({
      where: { email: 'admin@example.com' },
      attributes: ['id', 'name', 'email', 'password', 'role', 'isActive'],
      raw: true
    });

    if (adminUser) {
      console.log('=== ADMIN USER (admin@example.com) ===');
      console.log('  ✅ Found in database');
      console.log(`  ID: ${adminUser.id}`);
      console.log(`  Name: ${adminUser.name}`);
      console.log(`  Email: ${adminUser.email}`);
      console.log(`  Role: ${adminUser.role}`);
      console.log(`  Is Active: ${adminUser.isActive}`);
      console.log(`  Password Hash: ${adminUser.password}`);
      console.log(`  Password Hash Starts With: ${adminUser.password ? adminUser.password.substring(0, 7) : 'N/A'}`);
      
      // Check if it's a bcrypt hash (should start with $2a$, $2b$, or $2y$)
      const isBcryptHash = adminUser.password && (
        adminUser.password.startsWith('$2a$') || 
        adminUser.password.startsWith('$2b$') || 
        adminUser.password.startsWith('$2y$')
      );
      console.log(`  Is Valid Bcrypt Hash: ${isBcryptHash ? '✅ Yes' : '❌ No'}`);
    } else {
      console.log('❌ Admin user (admin@example.com) NOT FOUND in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();
