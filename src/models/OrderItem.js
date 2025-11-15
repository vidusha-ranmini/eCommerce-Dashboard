import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  hooks: {
    beforeCreate: (orderItem) => {
      // Auto-calculate subtotal before creating
      orderItem.subtotal = (parseFloat(orderItem.price) * parseInt(orderItem.quantity, 10)).toFixed(2);
      console.log(`📊 OrderItem beforeCreate: quantity=${orderItem.quantity}, price=${orderItem.price}, subtotal=${orderItem.subtotal}`);
    },
    beforeUpdate: (orderItem) => {
      // Auto-calculate subtotal before updating
      if (orderItem.changed('price') || orderItem.changed('quantity')) {
        orderItem.subtotal = (parseFloat(orderItem.price) * parseInt(orderItem.quantity, 10)).toFixed(2);
        console.log(`📊 OrderItem beforeUpdate: quantity=${orderItem.quantity}, price=${orderItem.price}, subtotal=${orderItem.subtotal}`);
      }
    }
  }
});

export default OrderItem;
