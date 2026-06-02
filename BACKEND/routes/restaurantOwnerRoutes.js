const express = require('express');
const router = express.Router();
const { loginOwner, registerOwner, getOwnerRestaurant, updateRestaurant, createRestaurant } = require('../controllers/restaurantOwnerController');

// Login route
router.post('/login', loginOwner);

// Register route
router.post('/register', registerOwner);

// Get owner's restaurant
router.get('/:ownerId/restaurant', getOwnerRestaurant);

// Update restaurant details
router.put('/:ownerId/restaurant', updateRestaurant);

// Create a new restaurant for an owner
router.post('/restaurants', createRestaurant);

module.exports = router; 