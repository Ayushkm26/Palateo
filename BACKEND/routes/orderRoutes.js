const express = require('express');
const orderModel = require('../data/orders');
const router = express.Router();
const { placeOrder, getOrdersByRestaurant, getOrdersByUser } = require('../controllers/orderController');

// Place a new order
router.post('/place', placeOrder);

// Get all orders for a restaurant
router.get('/restaurant/:restaurantId', getOrdersByRestaurant);

// Get all orders for a user
router.get('/user/:userId', getOrdersByUser);

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Add review for a restaurant
router.post('/review', async (req, res) => {
  const path = require('path');
  const { readJsonFile, writeJsonFile } = require('../util/fileUtils');
  try {
    const { restaurantId, userId, orderId, stars, remarks } = req.body;
    if (!restaurantId || !userId || !orderId || !stars) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const filePath = path.join(__dirname, '../data/reviews.json');
    const data = await readJsonFile(filePath);
    if (!data.reviews) data.reviews = [];
    data.reviews.push({
      id: Date.now().toString(),
      restaurantId,
      userId,
      orderId,
      stars,
      remarks: remarks || '',
      createdAt: new Date().toISOString()
    });
    await writeJsonFile(filePath, data);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save review' });
  }
});

module.exports = router;
