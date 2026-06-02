const orderModel = require('../data/orders');

const placeOrder = async (req, res) => {
  try {
    const { restaurantId, userId, name, address, phone, cartItems } = req.body;

    const order = new orderModel({
      restaurantId,
      userId,
      name,
      address,
      phone,
      cartItems,
      status: 'pending' // Explicitly set initial status
    });

    await order.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Order save error:', error);
    res.status(500).json({ success: false, error: 'Failed to save order' });
  }
};

const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await orderModel.find({ restaurantId });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch restaurant orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user orders' });
  }
};

module.exports = { placeOrder, getOrdersByRestaurant, getOrdersByUser };
