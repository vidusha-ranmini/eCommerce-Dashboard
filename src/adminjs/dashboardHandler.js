import { User, Product, Order, Category, OrderItem } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

const getDashboardData = async (currentAdmin) => {
  try {
    const isAdmin = currentAdmin.role === 'admin';

    // Regular User Dashboard - Personal insights only
    if (!isAdmin) {
      const userId = currentAdmin.id;
      
      const [
        userOrders,
        recentOrders,
        totalSpent,
        pendingOrders,
        ordersByStatus
      ] = await Promise.all([
        Order.count({ where: { userId } }),
        Order.findAll({
          where: { userId },
          limit: 10,
          order: [['createdAt', 'DESC']]
        }),
        Order.sum('totalAmount', {
          where: {
            userId,
            paymentStatus: 'paid'
          }
        }),
        Order.count({
          where: {
            userId,
            status: { [Op.in]: ['pending', 'processing'] }
          }
        }),
        Order.findAll({
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          where: { userId },
          group: ['status'],
          raw: true
        })
      ]);

      return {
        welcome: {
          name: currentAdmin.name,
          role: 'User',
          message: 'Welcome to your personal dashboard'
        },
        stats: {
          totalOrders: {
            value: userOrders,
            label: 'My Orders',
            icon: 'ShoppingCart'
          },
          totalSpent: {
            value: `$${(totalSpent || 0).toFixed(2)}`,
            label: 'Total Spent',
            icon: 'DollarSign'
          },
          pendingOrders: {
            value: pendingOrders,
            label: 'Active Orders',
            icon: 'Clock'
          }
        },
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: parseFloat(order.totalAmount).toFixed(2),
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt
        })),
        userInfo: {
          email: currentAdmin.email,
          name: currentAdmin.name,
          role: currentAdmin.role
        }
      };
    }

    // Admin dashboard - full system insights
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      recentOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      ordersByStatus,
      topProducts
    ] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Category.count(),
      Order.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
      }),
      Order.sum('totalAmount', {
        where: {
          paymentStatus: 'paid'
        }
      }),
      Order.count({
        where: {
          status: 'pending'
        }
      }),
      Product.findAll({
        where: {
          stock: {
            [Op.lte]: 10
          }
        },
        limit: 5,
        order: [['stock', 'ASC']],
        attributes: ['id', 'name', 'stock', 'sku']
      }),
      Order.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      }),
      OrderItem.findAll({
        attributes: [
          'productId',
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
          [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue']
        ],
        include: [{
          model: Product,
          as: 'product',
          attributes: ['name', 'sku']
        }],
        group: ['productId', 'product.id', 'product.name', 'product.sku'],
        order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
        limit: 5,
        raw: false
      })
    ]);

    return {
      welcome: {
        name: currentAdmin.name,
        role: 'Administrator',
        message: 'Welcome to your admin dashboard'
      },
      stats: {
        totalUsers: {
          value: totalUsers,
          label: 'Total Users',
          icon: 'User'
        },
        totalProducts: {
          value: totalProducts,
          label: 'Total Products',
          icon: 'ShoppingBag'
        },
        totalOrders: {
          value: totalOrders,
          label: 'Total Orders',
          icon: 'ShoppingCart'
        },
        totalCategories: {
          value: totalCategories,
          label: 'Categories',
          icon: 'Tag'
        },
        totalRevenue: {
          value: `$${(totalRevenue || 0).toFixed(2)}`,
          label: 'Total Revenue',
          icon: 'DollarSign'
        },
        pendingOrders: {
          value: pendingOrders,
          label: 'Pending Orders',
          icon: 'Clock'
        }
      },
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {}),
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock
      })),
      topProducts: topProducts.map(item => ({
        productId: item.productId,
        name: item.product?.name || 'Unknown',
        sku: item.product?.sku || 'N/A',
        totalQuantity: parseInt(item.get('totalQuantity')),
        totalRevenue: parseFloat(item.get('totalRevenue') || 0).toFixed(2)
      })),
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        userName: order.user?.name || 'N/A',
        userEmail: order.user?.email || 'N/A',
        totalAmount: parseFloat(order.totalAmount).toFixed(2),
        status: order.status,
        createdAt: order.createdAt
      }))
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export { getDashboardData };
