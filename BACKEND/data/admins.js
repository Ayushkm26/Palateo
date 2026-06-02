const mongoose = require('mongoose');

const admins = new mongoose.Schema({
  id:{
    type: Number,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
})
// const admins = [
  // {
    
  // }
// ];
const adminModel = mongoose.model('Admin', admins);

module.exports = adminModel;