import { sequelize } from '../config/database.js';
import { User } from '../models/index.js';

async function checkUserRoles() {
  try {
    console.log('🔍 Checking user roles in database...\n');
    
    await sequelize.authenticate();
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isActive']
    });
    
    console.log('Users in database:');
    console.log('==================');
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: "${user.role}" (type: ${typeof user.role})`);
      console.log(`Active: ${user.isActive}`);
      console.log('---');
    });
    
    console.log(`\nTotal users: ${users.length}`);
    
    const adminUsers = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role === 'user');
    
    console.log(`Admin users: ${adminUsers.length}`);
    console.log(`Regular users: ${regularUsers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUserRoles();
