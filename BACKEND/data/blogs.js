const mongoose = require('mongoose');

const blogScema = new mongoose.Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  content:{
    type: String,
  },
  author:{
    type: String,
  },
  date:{
    type: Date,
  },
  category:{
    type: String,
  },
  img:{
    type: String,
  },
  tags:{
    type: Array,
  }
})
const blogModel = mongoose.model('Blog', blogScema);
module.exports = blogModel;
// {
//   "blogs": 

// }