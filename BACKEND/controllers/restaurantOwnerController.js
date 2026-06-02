// controllers/restaurantOwnerController.js

const restaurantOwnerModel = require('../data/restaurantOwners');
const restaurantModel = require('../data/restaurants');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'your-secret-key'; // Use env variable in production

// Login restaurant owner
const loginOwner = async (req, res) => {
  try {
    const { username, password } = req.body;

    const owner = await restaurantOwnerModel.findOne({ username });
    if (!owner) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password using bcrypt
    const isValidPassword = await bcrypt.compare(password, owner.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: owner.id,
        username: owner.username,
        restaurantId: owner.restaurantId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      id: owner.id,
      username: owner.username,
      restaurantId: owner.restaurantId,
      email: owner.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Register a new restaurant owner
const registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingOwner = await restaurantOwnerModel.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Always get the last id and increment
    const lastOwner = await restaurantOwnerModel.findOne().sort({ id: -1 });
    const lastId = lastOwner ? parseInt(lastOwner.id) : 0;
    const nextId = (lastId + 1).toString();

    const username = name.toLowerCase().replace(/\s+/g, '_');

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newOwner = new restaurantOwnerModel({
      id: nextId,
      username,
      email,
      password: hashedPassword,
      // restaurantId will be set when restaurant is created
    });

    await newOwner.save();

    res.status(201).json({
      message: 'Owner registered successfully',
      owner: {
        id: newOwner.id,
        username: newOwner.username,
        email: newOwner.email
      }
    });
  } catch (error) {
    console.error('Error registering owner:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    
    res.status(500).json({ 
      message: 'Error registering owner',
      error: error.message 
    });
  }
};

// Create a new restaurant for an owner
const createRestaurant = async (req, res) => {
  try {
    const {
      ownerId,
      name,
      image,
      categories,
      cuisine,
      hasFreeDelivery,
      minOrder,
      description,
      deliveryTime,
      address,
      location
    } = req.body;

    const owner = await restaurantOwnerModel.findOne({ id: ownerId });
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Validate required fields (match schema)
    if (!name || !image || !categories || !cuisine || !minOrder || !description || !deliveryTime || !address || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate a new restaurant id (auto-increment)
    const lastRestaurant = await restaurantModel.findOne().sort({ id: -1 });
    const nextId = lastRestaurant ? parseInt(lastRestaurant.id) + 1 : 1;

    const newRestaurant = new restaurantModel({
      id: nextId,
      name,
      image,
      categories,
      cuisine,
      hasFreeDelivery,
      minOrder,
      description,
      deliveryTime,
      address,
      location,
      rating: 4.5,
      isOpen: true
    });

    const savedRestaurant = await newRestaurant.save();

    // Update owner's restaurantId to match new restaurant
    owner.restaurantId = nextId;
    await owner.save();

    if (!savedRestaurant) {
      return res.status(500).json({ message: 'Failed to create restaurant' });
    }

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: savedRestaurant
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Error creating restaurant' });
  }
};

// Get owner's restaurant
const getOwnerRestaurant = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await restaurantOwnerModel.findOne({id: ownerId});
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const restaurant = await restaurantModel.findOne({id: owner.restaurantId});
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Error fetching restaurant' });
  }
};

// Update restaurant details
const updateRestaurant = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { name, cuisine, location, image } = req.body;

    const owner = await restaurantOwnerModel.findOne({id:ownerId});
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const restaurant = await restaurantModel.findOne({id: owner.restaurantId});
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.cuisine = cuisine || restaurant.cuisine;
    restaurant.location = location || restaurant.location;
    restaurant.image = image || restaurant.image;

    const updatedRestaurant = await restaurant.save();

    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant' });
  }
};

module.exports = {
  loginOwner,
  registerOwner,
  createRestaurant,
  getOwnerRestaurant,
  updateRestaurant
};