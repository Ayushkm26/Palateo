const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Restaurant Schema
const restaurantSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  categories: [{
    type: String,
  }],
  rating: {
    type: Number,
  },
  deliveryTime: {
    type: String,
  },
  address: {
    type: String,
  },
  cuisine: {
    type: String,
  },
  isOpen: {
    type: Boolean,
  },
  hasFreeDelivery: {
    type: Boolean,
  },
  minOrder: {
    type: Number,
  },
  description: {
    type: String,
  }
});

// Create the Restaurant model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Remove or comment out the restaurant with id: 27
// Example:
// {
//   id: 27,
//   name: "Problematic Restaurant",
//   // ...other fields...
// }

module.exports = Restaurant;
