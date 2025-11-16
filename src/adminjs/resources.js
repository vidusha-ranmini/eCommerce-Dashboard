import { User, Category, Product, Order, OrderItem, Setting } from '../models/index.js';
import { Op } from 'sequelize';
import { clearSettingsCache } from '../utils/settings.js';

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
      },
      list: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      show: {
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
      list: {
        // Both admin and user can view categories
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
      },
      show: {
        // Both can view category details
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
      },
      new: {
        // Only admin can create categories
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        // Only admin can edit categories
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      delete: {
        // Only admin can delete categories
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    },
    // All authenticated users can access categories
    isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
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
      list: {
        // Both admin and user can view products
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
      },
      show: {
        // Both can view product details
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
      },
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
        // Only admin can create products
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
        // Only admin can edit products
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      delete: {
        // Only admin can delete products
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    },
    // All authenticated users can access products (view only for normal users)
    isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
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
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      userId: {
        type: 'reference',
        isVisible: {
          list: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
          filter: true,
          show: true,
          edit: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
        },
        isRequired: true
      },
      'user.name': {
        isVisible: {
          list: false,  // Hide from list
          filter: false,
          show: false,  // Hide from show view
          edit: false
        }
      },
      'user.email': {
        isVisible: {
          list: false,  // Hide from list
          filter: false,
          show: false,  // Hide from show view
          edit: false
        }
      },
      orderNumber: {
        isVisible: {
          list: true,
          filter: true,
          show: true,
          edit: false,
          new: false  // Hide in creation form (auto-generated)
        },
        isRequired: false
      },
      subtotal: {
        type: 'number',
        isVisible: { list: true, filter: false, show: true, edit: true },
        isRequired: true,
        props: {
          step: 0.01,
          min: 0
        }
      },
      taxRate: {
        type: 'number',
        isVisible: { list: false, filter: false, show: true, edit: true },
        props: {
          step: 0.01,
          min: 0
        },
        custom: {
          after: () => '% (loaded from GLOBAL_TAX_RATE setting)'
        }
      },
      taxAmount: {
        type: 'number',
        isVisible: { list: false, filter: false, show: true, edit: false },
        props: {
          step: 0.01,
          min: 0,
          disabled: true
        }
      },
      shippingCost: {
        type: 'number',
        isVisible: { list: false, filter: false, show: true, edit: true },
        props: {
          step: 0.01,
          min: 0
        }
      },
      totalAmount: {
        type: 'number',
        isVisible: { list: true, filter: false, show: true, edit: false },
        props: {
          step: 0.01,
          min: 0,
          disabled: true
        }
      },
      shippingAddress: {
        type: 'textarea',
        isVisible: { list: false, filter: false, show: true, edit: true },
        isRequired: true
      },
      status: {
        isVisible: { list: true, filter: true, show: true, edit: true },
        availableValues: [
          { value: 'pending', label: 'Pending' },
          { value: 'processing', label: 'Processing' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' }
        ]
      },
      paymentMethod: {
        isVisible: { list: true, filter: true, show: true, edit: true },
        availableValues: [
          { value: 'cash', label: 'Cash' },
          { value: 'credit_card', label: 'Credit Card' },
          { value: 'paypal', label: 'PayPal' }
        ]
      },
      paymentStatus: {
        isVisible: { list: true, filter: true, show: true, edit: true },
        availableValues: [
          { value: 'pending', label: 'Pending' },
          { value: 'paid', label: 'Paid' },
          { value: 'failed', label: 'Failed' },
          { value: 'refunded', label: 'Refunded' }
        ]
      },
      notes: {
        type: 'textarea',
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: true,
          new: false  // Hide in creation form
        }
      },
      createdAt: {
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    actions: {
      list: {
        // Both admin and user can see all orders
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
      },
      show: {
        // Both admin and user can view all order details
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
      },
      new: {
        // Only admin can create orders
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        before: async (request, context) => {
          console.log('\n=== Order Creation - Before Hook ===');
          console.log('Raw payload:', JSON.stringify(request.payload, null, 2));

          if (request.payload) {
            // Remove orderNumber if it exists (it's auto-generated)
            if (request.payload.orderNumber !== undefined) {
              delete request.payload.orderNumber;
              console.log('Removed orderNumber from payload (auto-generated)');
            }

            // Convert userId to integer
            if (request.payload.userId) {
              const userIdNum = parseInt(request.payload.userId, 10);
              console.log(`Converting userId: "${request.payload.userId}" (${typeof request.payload.userId}) -> ${userIdNum} (${typeof userIdNum})`);
              request.payload.userId = userIdNum;
            }

            // Convert numeric fields
            if (request.payload.subtotal !== undefined && request.payload.subtotal !== '') {
              request.payload.subtotal = parseFloat(request.payload.subtotal);
            }
            if (request.payload.taxRate !== undefined && request.payload.taxRate !== '') {
              request.payload.taxRate = parseFloat(request.payload.taxRate);
            }
            if (request.payload.taxAmount !== undefined && request.payload.taxAmount !== '') {
              request.payload.taxAmount = parseFloat(request.payload.taxAmount);
            }
            if (request.payload.shippingCost !== undefined && request.payload.shippingCost !== '') {
              request.payload.shippingCost = parseFloat(request.payload.shippingCost);
            }
            if (request.payload.totalAmount !== undefined && request.payload.totalAmount !== '') {
              request.payload.totalAmount = parseFloat(request.payload.totalAmount);
            }

            // Remove auto-calculated fields from payload
            delete request.payload.taxAmount;
            delete request.payload.totalAmount;

            // Handle optional fields - convert empty strings to null
            if (request.payload.paymentMethod === '') {
              request.payload.paymentMethod = null;
            }
            if (request.payload.notes === '') {
              request.payload.notes = null;
            }

            console.log('Processed payload:', JSON.stringify(request.payload, null, 2));
          }

          return request;
        },
        after: async (response, request, context) => {
          console.log('\n=== Order Creation - After Hook ===');
          if (response.record && response.record.errors) {
            console.log('❌ Validation errors:', JSON.stringify(response.record.errors, null, 2));
          } else if (response.record) {
            console.log('✅ Order created successfully:', response.record.params);
          }
          return response;
        }
      },
      edit: {
        // Only admin can edit orders
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        before: async (request, context) => {
          console.log('\n=== Order Edit - Before Hook ===');
          console.log('Raw payload:', JSON.stringify(request.payload, null, 2));

          if (request.payload) {
            // Convert userId to integer if present
            if (request.payload.userId) {
              const userIdNum = parseInt(request.payload.userId, 10);
              console.log(`Converting userId: "${request.payload.userId}" -> ${userIdNum}`);
              request.payload.userId = userIdNum;
            }

            // Convert numeric fields
            if (request.payload.subtotal !== undefined && request.payload.subtotal !== '') {
              request.payload.subtotal = parseFloat(request.payload.subtotal);
            }
            if (request.payload.taxRate !== undefined && request.payload.taxRate !== '') {
              request.payload.taxRate = parseFloat(request.payload.taxRate);
            }
            if (request.payload.shippingCost !== undefined && request.payload.shippingCost !== '') {
              request.payload.shippingCost = parseFloat(request.payload.shippingCost);
            }

            // Remove auto-calculated fields from payload
            delete request.payload.taxAmount;
            delete request.payload.totalAmount;

            // Handle optional fields
            if (request.payload.paymentMethod === '') {
              request.payload.paymentMethod = null;
            }
            if (request.payload.notes === '') {
              request.payload.notes = null;
            }

            console.log('Processed payload:', JSON.stringify(request.payload, null, 2));
          }

          return request;
        }
      },
      delete: {
        // Only admin can delete
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      bulkDelete: {
        // Only admin can bulk delete
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    },
    // All authenticated users can access orders (view only for normal users)
    isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
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
    parent: {
      name: 'Orders',
      icon: 'ShoppingCart'
    },
    listProperties: ['id', 'order.orderNumber', 'product.name', 'quantity', 'price', 'subtotal'],
    properties: {
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      orderId: {
        isVisible: { list: false, filter: true, show: true, edit: true },
        isRequired: true,
        reference: 'orders'
      },
      'order.orderNumber': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      productId: {
        isVisible: { list: false, filter: true, show: true, edit: true },
        isRequired: true,
        reference: 'products'
      },
      'product.name': {
        isVisible: { list: true, filter: false, show: true, edit: false }
      },
      quantity: {
        type: 'number',
        isVisible: { list: true, filter: false, show: true, edit: true },
        isRequired: true,
        props: {
          step: 1,
          min: 1
        }
      },
      price: {
        type: 'number',
        isVisible: { list: true, filter: false, show: true, edit: true },
        isRequired: true,
        props: {
          step: 0.01,
          min: 0
        }
      },
      subtotal: {
        type: 'number',
        isVisible: { list: true, filter: false, show: true, edit: false },
        props: {
          disabled: true
        }
      },
      createdAt: {
        isVisible: { list: false, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: false, filter: false, show: true, edit: false }
      }
    },
    actions: {
      list: {
        // Both admin and user can see order items
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        handler: async (request, response, context) => {
          const { resource } = context;

          // Get all order items with related data
          const orderItems = await OrderItem.findAll({
            include: [
              {
                model: Order,
                as: 'order',
                attributes: ['id', 'orderNumber']
              },
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name']
              }
            ],
            order: [['id', 'DESC']]
          });

          console.log('📋 Loaded order items:', orderItems.length);
          if (orderItems.length > 0) {
            console.log('Sample item:', JSON.stringify({
              id: orderItems[0].id,
              order: orderItems[0].order,
              product: orderItems[0].product
            }, null, 2));
          }

          // Convert to AdminJS records
          const records = orderItems.map(item => {
            return resource.build({
              ...item.toJSON(),
              'order.orderNumber': item.order?.orderNumber,
              'product.name': item.product?.name
            });
          });

          return {
            records,
            meta: {
              total: orderItems.length,
              perPage: orderItems.length,
              page: 1
            }
          };
        }
      },
      show: {
        // Both can view order item details
        isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
      },
      new: {
        // Only admin can create order items
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        before: async (request, context) => {
          console.log('\n=== OrderItem Creation - Before Hook ===');
          console.log('Raw payload:', JSON.stringify(request.payload, null, 2));

          if (request.payload) {
            // Convert orderId to integer
            if (request.payload.orderId) {
              request.payload.orderId = parseInt(request.payload.orderId, 10);
            }

            // Convert productId to integer
            if (request.payload.productId) {
              request.payload.productId = parseInt(request.payload.productId, 10);
            }

            // Convert quantity to integer
            if (request.payload.quantity) {
              request.payload.quantity = parseInt(request.payload.quantity, 10);
            }

            // Convert price to float
            if (request.payload.price !== undefined && request.payload.price !== '') {
              request.payload.price = parseFloat(request.payload.price);
            }

            // Remove subtotal if present (it's auto-calculated)
            if (request.payload.subtotal !== undefined) {
              delete request.payload.subtotal;
            }

            console.log('Processed payload:', JSON.stringify(request.payload, null, 2));
          }

          return request;
        },
        after: async (response, request, context) => {
          if (response.record && response.record.errors) {
            console.log('❌ OrderItem validation errors:', JSON.stringify(response.record.errors, null, 2));
          } else if (response.record) {
            console.log('✅ OrderItem created successfully');
          }
          return response;
        }
      },
      edit: {
        // Only admin can edit order items
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        before: async (request, context) => {
          console.log('\n=== OrderItem Edit - Before Hook ===');
          console.log('Raw payload:', JSON.stringify(request.payload, null, 2));

          if (request.payload) {
            // Convert orderId to integer if present
            if (request.payload.orderId) {
              request.payload.orderId = parseInt(request.payload.orderId, 10);
            }

            // Convert productId to integer if present
            if (request.payload.productId) {
              request.payload.productId = parseInt(request.payload.productId, 10);
            }

            // Convert quantity to integer if present
            if (request.payload.quantity) {
              request.payload.quantity = parseInt(request.payload.quantity, 10);
            }

            // Convert price to float if present
            if (request.payload.price !== undefined && request.payload.price !== '') {
              request.payload.price = parseFloat(request.payload.price);
            }

            // Remove subtotal if present (it's auto-calculated)
            if (request.payload.subtotal !== undefined) {
              delete request.payload.subtotal;
            }

            console.log('Processed payload:', JSON.stringify(request.payload, null, 2));
          }

          return request;
        }
      },
      delete: {
        // Only admin can delete order items
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      bulkDelete: {
        // Only admin can bulk delete
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      }
    },
    // All authenticated users can access order items (view only for normal users)
    isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user')
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
        isTitle: true,
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      value: {
        isVisible: { list: true, filter: false, show: true, edit: true },
        isRequired: true
      },
      description: {
        isVisible: { list: false, filter: false, show: true, edit: true }
      },
      type: {
        isVisible: { list: true, filter: true, show: true, edit: false },
        availableValues: [
          { value: 'string', label: 'String' },
          { value: 'number', label: 'Number' },
          { value: 'boolean', label: 'Boolean' },
          { value: 'json', label: 'JSON' }
        ]
      },
      createdAt: {
        isVisible: { list: false, filter: true, show: true, edit: false }
      },
      updatedAt: {
        isVisible: { list: true, filter: false, show: true, edit: false }
      }
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        after: async (response, request, context) => {
          // Clear settings cache when a setting is updated
          clearSettingsCache();
          console.log('🔄 Settings cache cleared after update');
          return response;
        }
      },
      list: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      show: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
      },
      bulkDelete: {
        isAccessible: false // Prevent accidental deletion of settings
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
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
