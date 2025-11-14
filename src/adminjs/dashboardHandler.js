import { User, Product, Order, Category } from '../models/index.js';
import { Op } from 'sequelize';

const getDashboardData = async (currentAdmin) => {
  try {
    const isAdmin = currentAdmin.role === 'admin';

    if (isAdmin) {
      // Admin dashboard - full system summary
      const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        recentOrders,
        totalRevenue,
        pendingOrders
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
        })
      ]);

      return {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          totalRevenue: totalRevenue || 0,
          pendingOrders
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          userName: order.user?.name || 'N/A',
          userEmail: order.user?.email || 'N/A',
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        }))
      };
    } else {
      // Regular user dashboard - personal info only
      const userOrders = await Order.findAll({
        where: { userId: currentAdmin.id },
        limit: 5,
        order: [['createdAt', 'DESC']]
      });

      const totalSpent = await Order.sum('totalAmount', {
        where: {
          userId: currentAdmin.id,
          paymentStatus: 'paid'
        }
      });

      return {
        userInfo: {
          name: currentAdmin.name,
          email: currentAdmin.email,
          role: currentAdmin.role
        },
        stats: {
          totalOrders: userOrders.length,
          totalSpent: totalSpent || 0
        },
        recentOrders: userOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        }))
      };
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export { getDashboardData };
