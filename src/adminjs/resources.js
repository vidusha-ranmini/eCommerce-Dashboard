import { User, Category, Product, Order, OrderItem, Setting } from '../models/index.js';

// Resource configuration for User
const userResource = {
  resource: User,
  options: {
    navigation: {
      name: 'User Management',
      icon: 'User'
    },
    properties: {
      password: {
        isVisible: false
      },
      createdAt: {
        isVisible: { list: false, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    },
    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
  }
};

// Resource configuration for Category
const categoryResource = {
  resource: Category,
  options: {
    navigation: {
      name: 'Catalog',
      icon: 'Tag'
    },
    properties: {
      slug: {
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      createdAt: {
        isVisible: { list: false, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    }
  }
};

// Resource configuration for Product
const productResource = {
  resource: Product,
  options: {
    navigation: {
      name: 'Catalog',
      icon: 'ShoppingBag'
    },
    properties: {
      categoryId: {
        isVisible: { list: false, filter: true, show: true, edit: true }
      },
      'category.name': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      createdAt: {
        isVisible: { list: false, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    }
  }
};

// Resource configuration for Order
const orderResource = {
  resource: Order,
  options: {
    navigation: {
      name: 'Orders',
      icon: 'ShoppingCart'
    },
    properties: {
      userId: {
        isVisible: { list: false, filter: true, show: true, edit: true }
      },
      'user.name': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      'user.email': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      orderNumber: {
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      createdAt: {
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    }
  }
};

// Resource configuration for OrderItem
const orderItemResource = {
  resource: OrderItem,
  options: {
    navigation: {
      name: 'Orders',
      icon: 'List'
    },
    properties: {
      orderId: {
        isVisible: { list: false, filter: true, show: true, edit: true }
      },
      productId: {
        isVisible: { list: false, filter: true, show: true, edit: true }
      },
      'order.orderNumber': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      'product.name': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      subtotal: {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      createdAt: {
        isVisible: { list: false, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    }
  }
};

// Resource configuration for Setting
const settingResource = {
  resource: Setting,
  options: {
    navigation: {
      name: 'Configuration',
      icon: 'Settings'
    },
    properties: {
      key: {
        isTitle: true
      },
      createdAt: {
        isVisible: { list: false, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
  }
};

export {
  userResource,
  categoryResource,
  productResource,
  orderResource,
  orderItemResource,
  settingResource
};
