const cartModel = require('../data/carts');

// Get user's cart
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        let cart = await cartModel.findOne({ userId:userId });

        if (!cart) {
            cart = new cartModel({ userId, items: [] });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Add or update item in cart
const addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { itemId, name, price, quantity, restaurantId, image } = req.body;

        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            cart = new cartModel({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.itemId === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                itemId,
                name,
                price,
                quantity,
                restaurantId,
                image
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { userId } = req.params;
        const { itemId, quantity } = req.body;

        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const item = cart.items.find(item => item.itemId === itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.itemId !== itemId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
};

// Remove an item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.params;

        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.itemId !== itemId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
