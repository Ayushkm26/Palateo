const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      itemId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      restaurantId: { type: String, required: true },
      image: { type: String, required: true }
    }
  ]
});

const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;