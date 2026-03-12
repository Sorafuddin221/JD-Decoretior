import Order from '@/models/orderModel';
import Product from '@/models/productModel';

/**
 * Calculates the available stock for a product during a specific date range.
 * @param {string} productId - The ID of the product.
 * @param {Date|string} startDate - Requested start date.
 * @param {Date|string} endDate - Requested end date.
 * @returns {Promise<number>} - Available quantity.
 */
export async function getAvailableStock(productId, startDate, endDate) {
    const product = await Product.findById(productId);
    if (!product) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all active orders that overlap with the requested dates
    // Overlap condition: (Order.startDate <= Requested.endDate) AND (Order.endDate >= Requested.startDate)
    const overlappingOrders = await Order.find({
        'orderItems.product': productId,
        orderStatus: { $ne: 'Cancelled' }, // Don't count cancelled orders
        $and: [
            { startDate: { $lte: end } },
            { endDate: { $gte: start } }
        ]
    });

    // Sum up the quantities already booked for these dates
    let bookedQuantity = 0;
    overlappingOrders.forEach(order => {
        const item = order.orderItems.find(item => item.product.toString() === productId.toString());
        if (item) {
            bookedQuantity += item.quantity;
        }
    });

    const available = product.stock - bookedQuantity;
    return Math.max(0, available);
}
