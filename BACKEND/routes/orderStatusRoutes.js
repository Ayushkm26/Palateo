const express = require('express');
const router = express.Router();
const { updateOrderStatus } = require('../controllers/orderStatusController');

// Update order status
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
