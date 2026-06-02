const orderModel = require('../data/orders'); // Mongoose model

// Update order status (MongoDB version)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Optional: validate status value
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status,
        updatedAt: new Date().toISOString()
      },
      { new: true } // Return the updated doc
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
};

module.exports = { updateOrderStatus };
