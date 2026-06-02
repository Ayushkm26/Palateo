const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require('./util/connectDB');
const restaurantRoutes = require('./routes/restaurantRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cartRoutes = require('./routes/cartRoutes');
const menuRoutes = require('./routes/menuRoutes');
const restaurantOwnerRoutes = require('./routes/restaurantOwnerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderStatusRoutes = require('./routes/orderStatusRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow all origins during development
  credentials: true // Allow cookies to be sent
}));
connectDB(); // Connect to MongoDB
app.use(express.json());
app.use(cookieParser()); // Add cookie parser for handling JWT in cookies

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/owners', restaurantOwnerRoutes);
app.use('/api/admin', adminRoutes); // Add admin routes
app.use('/api/orders', orderRoutes);
app.use('/api/order-status', orderStatusRoutes);
app.use('/api/admin-restaurant-owner', require('./routes/adminRestaurantOwnerRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});