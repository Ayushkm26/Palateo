const mongoose = require('mongoose');

const restaurantOwnerSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  restaurantId: {
    type: Number,
  }
})

const restaurantOwnerModel = mongoose.model('RestaurantOwner', restaurantOwnerSchema);
module.exports = restaurantOwnerModel;

// // {
//   "restaurants": 
// // }

