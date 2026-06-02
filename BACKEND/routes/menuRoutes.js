const express = require('express');
const router = express.Router();
const { getMenuByRestaurantId, addMenuItem, addMenuForRestaurant, deleteMenuItem } = require('../controllers/menuController');
const { authenticateToken, verifyRestaurantOwner } = require('../middleware/authMiddleware');

// Public route - anyone can view menu
router.get('/:id', getMenuByRestaurantId);

// Protected routes - only authenticated restaurant owners can modify their own menu
router.post('/:id/items', authenticateToken, verifyRestaurantOwner, addMenuItem);
router.delete('/:id/items/:itemId', authenticateToken, verifyRestaurantOwner, deleteMenuItem);

module.exports = router; 