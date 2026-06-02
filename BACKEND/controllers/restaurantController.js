const Restaurant = require('../data/restaurants'); // adjust path as needed

// GET all restaurants
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json({ restaurants }); // Always return as { restaurants: [...] }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET restaurant by ID
const getRestaurantById = async (req, res) => {
    try {
        console.log(req.params.id);
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json({ restaurant }); // Always wrap in { restaurant: ... }
    } catch (error) {
        console.error('Error in getRestaurantById:', error);
        res.status(500).json({ message: error.message });
    }
};

// POST create new restaurant
const createRestaurant = async (req, res) => {
    try {
        const {
            name,
            image,
            categories,
            cuisine,
            address,
            location,
            deliveryTime,
            hasFreeDelivery,
            minOrder,
            description
        } = req.body;

        const requiredFields = ['name', 'image', 'categories', 'cuisine', 'address', 'location'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({
                message: 'Categories must be an array with at least one category'
            });
        }

        // Generate a new ID (manually, if needed)
        const lastRestaurant = await Restaurant.findOne().sort({ id: -1 });
        const nextId = lastRestaurant ? parseInt(lastRestaurant.id) + 1 : 1;
        console.log('Next ID:', nextId);

        const newRestaurant = new Restaurant({
            id: nextId,
            name,
            image,
            categories,
            rating: 4.5,
            deliveryTime: deliveryTime || '30-40 minutes',
            address,
            cuisine,
            isOpen: true,
            hasFreeDelivery: hasFreeDelivery || false,
            minOrder: minOrder || 15,
            description: description || `${cuisine} restaurant`,
            location
        });

        await newRestaurant.save();

        res.status(201).json({ restaurant: newRestaurant });
    } catch (error) {
        console.error('Error in createRestaurant:', error);
        res.status(500).json({ message: error.message });
    }
};

// PUT update restaurant
const updateRestaurant = async (req, res) => {
    try {
        const updated = await Restaurant.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE restaurant
const deleteRestaurant = async (req, res) => {
    try {
        const deleted = await Restaurant.findOneAndDelete({ id: req.params.id });
        if (!deleted) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
