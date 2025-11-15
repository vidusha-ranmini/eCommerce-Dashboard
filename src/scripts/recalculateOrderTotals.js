import { sequelize } from '../config/database.js';
import { Order, OrderItem } from '../models/index.js';

async function recalculateOrderTotals() {
  try {
    console.log('🔄 Starting order total recalculation...\n');

    // Get all orders
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'orderItems'
      }]
    });

    console.log(`Found ${orders.length} orders to process\n`);

    for (const order of orders) {
      const orderItems = order.orderItems || [];
      
      if (orderItems.length === 0) {
        console.log(`⚠️  Order ${order.orderNumber} has no items, keeping current total: ${order.totalAmount}`);
        continue;
      }

      // Calculate total from order items
      const calculatedTotal = orderItems.reduce((sum, item) => {
        const itemSubtotal = parseFloat(item.subtotal) || 0;
        return sum + itemSubtotal;
      }, 0);

      const roundedTotal = parseFloat(calculatedTotal.toFixed(2));

      if (parseFloat(order.totalAmount) !== roundedTotal) {
        console.log(`📝 Order ${order.orderNumber}:`);
        console.log(`   Current total: ${order.totalAmount}`);
        console.log(`   Calculated from ${orderItems.length} items: ${roundedTotal}`);
        console.log(`   Items breakdown:`);
        orderItems.forEach(item => {
          console.log(`     - Qty: ${item.quantity} x Price: ${item.price} = ${item.subtotal}`);
        });

        // Update the order total
        await order.update({ totalAmount: roundedTotal });
        console.log(`   ✅ Updated to ${roundedTotal}\n`);
      } else {
        console.log(`✓ Order ${order.orderNumber} total is correct: ${order.totalAmount}\n`);
      }
    }

    console.log('✅ Order total recalculation completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error recalculating order totals:', error);
    process.exit(1);
  }
}

// Run the recalculation
recalculateOrderTotals();
