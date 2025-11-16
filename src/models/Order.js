import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Changed from { sequelize }

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 10,
    comment: 'Tax rate percentage'
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5.00,
    validate: {
      min: 0
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeValidate: async (order) => {
      // Auto-generate order number before validation
      if (!order.orderNumber) {
        order.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        console.log(`🔢 Generated order number: ${order.orderNumber}`);
      }
      
      // Ensure subtotal has a value
      if (order.subtotal === undefined || order.subtotal === null) {
        order.subtotal = 0;
      }
      
      // Load settings if not provided
      if (order.taxRate === undefined || order.taxRate === null) {
        try {
          const { Setting } = await import('./index.js');
          const taxRateSetting = await Setting.findOne({ where: { key: 'GLOBAL_TAX_RATE' } });
          if (taxRateSetting) {
            order.taxRate = parseFloat(taxRateSetting.value);
            console.log(`📊 Applied tax rate from settings: ${order.taxRate}%`);
          }
        } catch (error) {
          console.log('⚠️ Could not load tax rate from settings, using default');
        }
      }
      
      if (order.shippingCost === undefined || order.shippingCost === null) {
        try {
          const { Setting } = await import('./index.js');
          const shippingCostSetting = await Setting.findOne({ where: { key: 'SHIPPING_COST' } });
          const freeShippingMinimum = await Setting.findOne({ where: { key: 'FREE_SHIPPING_MINIMUM' } });
          
          if (freeShippingMinimum && order.subtotal >= parseFloat(freeShippingMinimum.value)) {
            order.shippingCost = 0;
            console.log(`🚚 Free shipping applied (subtotal >= ${freeShippingMinimum.value})`);
          } else if (shippingCostSetting) {
            order.shippingCost = parseFloat(shippingCostSetting.value);
            console.log(`📦 Applied shipping cost from settings: $${order.shippingCost}`);
          }
        } catch (error) {
          console.log('⚠️ Could not load shipping cost from settings, using default');
        }
      }
    },
    beforeSave: async (order) => {
      // Calculate tax amount based on subtotal and tax rate
      if (order.subtotal !== undefined && order.taxRate !== undefined) {
        order.taxAmount = (parseFloat(order.subtotal) * parseFloat(order.taxRate) / 100).toFixed(2);
        console.log(`💰 Calculated tax amount: $${order.taxAmount} (${order.taxRate}% of $${order.subtotal})`);
      }
      
      // Calculate total: subtotal + tax + shipping
      if (order.subtotal !== undefined && order.taxAmount !== undefined && order.shippingCost !== undefined) {
        order.totalAmount = (
          parseFloat(order.subtotal) + 
          parseFloat(order.taxAmount) + 
          parseFloat(order.shippingCost)
        ).toFixed(2);
        console.log(`🧮 Calculated total: $${order.totalAmount} (subtotal: $${order.subtotal} + tax: $${order.taxAmount} + shipping: $${order.shippingCost})`);
      }
    }
  }
});

export default Order;
