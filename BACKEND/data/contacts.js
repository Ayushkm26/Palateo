const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const contactModel = mongoose.model('Contact', contactSchema);
module.exports = contactModel;