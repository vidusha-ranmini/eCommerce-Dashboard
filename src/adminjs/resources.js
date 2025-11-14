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
        isVisible: { 
          list: false, 
          filter: false, 
          show: false, 
          edit: true 
        },
        type: 'password',
        isRequired: true
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
      price: {
        type: 'number',
        isRequired: true,
        props: {
          step: 0.01
        }
      },
      stock: {
        type: 'number',
        isRequired: true,
        props: {
          step: 1,
          min: 0
        }
      },
      sku: {
        isRequired: true
      },
      categoryId: {
        isVisible: { list: false, filter: true, show: true, edit: true },
        isRequired: true
      },
      'category.name': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      imageUrl: {
        isVisible: { list: false, filter: false, show: true, edit: true }
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
        before: async (request) => {
          try {
            if (request.payload) {
              console.log('🔧 Creating product with raw payload:', JSON.stringify(request.payload, null, 2));
              
              // Clean up empty strings and convert to proper types
              Object.keys(request.payload).forEach(key => {
                if (request.payload[key] === '' || request.payload[key] === 'null') {
                  request.payload[key] = null;
                }
              });
              
              // Ensure numeric values are properly converted
              if (request.payload.price !== undefined && request.payload.price !== null) {
                const priceNum = parseFloat(request.payload.price);
                if (isNaN(priceNum)) {
                  throw new Error(`Invalid price value: ${request.payload.price}`);
                }
                request.payload.price = priceNum;
                console.log('✓ Price converted to:', request.payload.price);
              }
              
              if (request.payload.stock !== undefined && request.payload.stock !== null) {
                const stockNum = parseInt(request.payload.stock, 10);
                if (isNaN(stockNum)) {
                  throw new Error(`Invalid stock value: ${request.payload.stock}`);
                }
                request.payload.stock = stockNum;
                console.log('✓ Stock converted to:', request.payload.stock);
              }
              
              if (request.payload.categoryId !== undefined && request.payload.categoryId !== null) {
                const catId = parseInt(request.payload.categoryId, 10);
                if (isNaN(catId)) {
                  throw new Error(`Invalid categoryId value: ${request.payload.categoryId}`);
                }
                request.payload.categoryId = catId;
                console.log('✓ CategoryId converted to:', request.payload.categoryId);
              }
              
              // Handle boolean conversion for isActive
              if (request.payload.isActive !== undefined) {
                request.payload.isActive = request.payload.isActive === true || request.payload.isActive === 'true' || request.payload.isActive === '1' || request.payload.isActive === 1;
                console.log('✓ IsActive converted to:', request.payload.isActive);
              }
              
              // Ensure description is null if empty
              if (request.payload.description === '') {
                request.payload.description = null;
              }
              
              // Ensure imageUrl is null if empty
              if (request.payload.imageUrl === '') {
                request.payload.imageUrl = null;
              }
              
              console.log('✅ Final processed payload:', JSON.stringify(request.payload, null, 2));
            }
            return request;
          } catch (error) {
            console.error('❌ Error in before hook:', error.message);
            throw error;
          }
        },
        after: async (response, request, context) => {
          if (response.record && response.record.errors) {
            console.error('❌ Product creation validation errors:', JSON.stringify(response.record.errors, null, 2));
          }
          return response;
        },
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        before: async (request) => {
          if (request.payload) {
            // Ensure numeric values are properly converted
            if (request.payload.price) {
              request.payload.price = parseFloat(request.payload.price);
            }
            if (request.payload.stock) {
              request.payload.stock = parseInt(request.payload.stock, 10);
            }
            if (request.payload.categoryId) {
              request.payload.categoryId = parseInt(request.payload.categoryId, 10);
            }
          }
          return request;
        },
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
