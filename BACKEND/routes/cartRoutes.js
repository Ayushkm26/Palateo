const express = require('express');
const router = express.Router();
const { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} = require('../controllers/cartController');

router.get('/:userId', getCart);
router.post('/:userId/add', addToCart);
router.put('/:userId/update', updateCartItem);
router.delete('/:userId/remove/:itemId', removeFromCart);
router.delete('/:userId/clear', clearCart);

module.exports = router;
