import { sequelize } from '../config/database.js';
import { Setting } from '../models/index.js';

const defaultSettings = [
  {
    key: 'GLOBAL_TAX_RATE',
    value: '10',
    description: 'Global tax rate percentage applied to all orders',
    type: 'number'
  },
  {
    key: 'SITE_NAME',
    value: 'E-Commerce Admin',
    description: 'Name of the e-commerce site',
    type: 'string'
  },
  {
    key: 'CURRENCY_SYMBOL',
    value: '$',
    description: 'Currency symbol for display',
    type: 'string'
  },
  {
    key: 'ITEMS_PER_PAGE',
    value: '20',
    description: 'Default number of items to display per page',
    type: 'number'
  },
  {
    key: 'ENABLE_REGISTRATION',
    value: 'true',
    description: 'Allow new user registrations',
    type: 'boolean'
  },
  {
    key: 'LOW_STOCK_THRESHOLD',
    value: '10',
    description: 'Threshold for low stock warnings',
    type: 'number'
  },
  {
    key: 'SHIPPING_COST',
    value: '5.00',
    description: 'Default shipping cost',
    type: 'number'
  },
  {
    key: 'FREE_SHIPPING_MINIMUM',
    value: '50.00',
    description: 'Minimum order amount for free shipping',
    type: 'number'
  }
];

async function seedSettings() {
  try {
    console.log('🌱 Starting settings seed...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Create or update each setting
    for (const setting of defaultSettings) {
      const [record, created] = await Setting.findOrCreate({
        where: { key: setting.key },
        defaults: setting
      });
      
      if (!created) {
        // Update existing setting with new description/type if changed
        await record.update({
          description: setting.description,
          type: setting.type
        });
        console.log(`📝 Updated setting: ${setting.key}`);
      } else {
        console.log(`✨ Created setting: ${setting.key} = ${setting.value}`);
      }
    }
    
    console.log('\n✅ Settings seeded successfully!');
    console.log('\nCurrent settings:');
    const allSettings = await Setting.findAll({ order: [['key', 'ASC']] });
    allSettings.forEach(s => {
      console.log(`  ${s.key}: ${s.value} (${s.type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    process.exit(1);
  }
}

seedSettings();
