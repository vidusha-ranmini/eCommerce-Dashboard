import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  hooks: {
    beforeCreate: async (product, options) => {
      console.log('🔍 Product beforeCreate hook:', {
        name: product.name,
        price: product.price,
        priceType: typeof product.price,
        stock: product.stock,
        stockType: typeof product.stock,
        sku: product.sku,
        categoryId: product.categoryId,
        categoryIdType: typeof product.categoryId
      });
    },
    afterCreate: async (product, options) => {
      console.log('✅ Product created successfully:', product.id);
    }
  },
  validate: {
    // Custom validation
    priceIsNumber() {
      if (isNaN(this.price)) {
        throw new Error('Price must be a valid number');
      }
    },
    stockIsInteger() {
      if (!Number.isInteger(this.stock)) {
        throw new Error('Stock must be an integer');
      }
    }
  }
});

export default Product;
