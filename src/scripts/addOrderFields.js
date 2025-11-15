import { sequelize } from '../config/database.js';
import { QueryTypes } from 'sequelize';

async function addOrderFields() {
  try {
    console.log('🔧 Adding new fields to orders table...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Check if columns already exist
    const columns = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'`,
      { type: QueryTypes.SELECT }
    );
    
    const existingColumns = columns.map(c => c.column_name);
    console.log('Existing columns:', existingColumns);
    
    // Add subtotal column if not exists
    if (!existingColumns.includes('subtotal')) {
      await sequelize.query(`
        ALTER TABLE orders 
        ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0
      `);
      console.log('✅ Added subtotal column');
    } else {
      console.log('⏭️  subtotal column already exists');
    }
    
    // Add taxRate column if not exists
    if (!existingColumns.includes('taxRate')) {
      await sequelize.query(`
        ALTER TABLE orders 
        ADD COLUMN "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 10
      `);
      console.log('✅ Added taxRate column');
    } else {
      console.log('⏭️  taxRate column already exists');
    }
    
    // Add taxAmount column if not exists
    if (!existingColumns.includes('taxAmount')) {
      await sequelize.query(`
        ALTER TABLE orders 
        ADD COLUMN "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0
      `);
      console.log('✅ Added taxAmount column');
    } else {
      console.log('⏭️  taxAmount column already exists');
    }
    
    // Add shippingCost column if not exists
    if (!existingColumns.includes('shippingCost')) {
      await sequelize.query(`
        ALTER TABLE orders 
        ADD COLUMN "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 5.00
      `);
      console.log('✅ Added shippingCost column');
    } else {
      console.log('⏭️  shippingCost column already exists');
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run seed:settings');
    console.log('2. Restart the server');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

addOrderFields();
