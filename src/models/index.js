import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Setting from './Setting.js';

// Define relationships

// Category - Product (One to Many)
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onDelete: 'CASCADE'
});
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// User - Order (One to Many)
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Order - OrderItem (One to Many)
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Product - OrderItem (One to Many)
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

export {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Setting
};
