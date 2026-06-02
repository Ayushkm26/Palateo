const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

dotenv.config();

const Admin = require('./data/admins');
const Blog = require('./data/blogs');
const Cart = require('./data/carts');
const Contact = require('./data/contacts');
const Menu = require('./data/menus');
const Order = require('./data/orders');
const RestaurantOwner = require('./data/restaurantOwners');
const Restaurant = require('./data/restaurants');
const User = require('./data/users');

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seedAllDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Add it to BACKEND/.env first.');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const dataPath = path.join(__dirname, 'sample-data-all.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('Clearing existing collections...');
    await Promise.all([
      Admin.deleteMany({}),
      Blog.deleteMany({}),
      Cart.deleteMany({}),
      Contact.deleteMany({}),
      Menu.deleteMany({}),
      Order.deleteMany({}),
      RestaurantOwner.deleteMany({}),
      Restaurant.deleteMany({}),
      User.deleteMany({})
    ]);

    console.log('Seeding admins...');
    await Admin.insertMany(await Promise.all(data.admins.map(async (admin) => ({
      ...admin,
      password: await hashPassword(admin.password),
      createdAt: new Date(),
      lastLogin: null
    }))));

    console.log('Seeding users...');
    const users = await User.insertMany(await Promise.all(data.users.map(async (user) => ({
      username: user.username,
      email: user.email,
      password: await hashPassword(user.password)
    }))));

    console.log('Seeding restaurants...');
    await Restaurant.insertMany(data.restaurants);

    console.log('Seeding restaurant owners...');
    await RestaurantOwner.insertMany(await Promise.all(data.restaurantOwners.map(async (owner) => ({
      ...owner,
      password: await hashPassword(owner.password)
    }))));

    console.log('Seeding menus...');
    await Menu.insertMany(data.menus);

    console.log('Seeding carts...');
    await Cart.insertMany(data.carts.map((cart) => ({
      userId: users[cart.userIndex]._id.toString(),
      items: cart.items
    })));

    console.log('Seeding orders...');
    const orders = await Order.insertMany(data.orders.map((order) => ({
      restaurantId: order.restaurantId,
      userId: users[order.userIndex]._id.toString(),
      name: order.name,
      address: order.address,
      phone: order.phone,
      cartItems: order.cartItems,
      status: order.status
    })));

    console.log('Seeding blogs...');
    await Blog.insertMany(data.blogs.map((blog) => ({
      ...blog,
      date: new Date(blog.date)
    })));

    console.log('Seeding contacts...');
    await Contact.insertMany(data.contacts);

    console.log('Writing reviews.json...');
    const reviews = data.reviews.map((review, index) => ({
      ...review,
      userId: users[index % users.length]._id.toString(),
      orderId: orders[index % orders.length]._id.toString()
    }));
    fs.writeFileSync(
      path.join(__dirname, 'data', 'reviews.json'),
      JSON.stringify({ reviews }, null, 2),
      'utf8'
    );

    console.log('\nDatabase seeded successfully.');
    console.log('\nLogin credentials:');
    console.log('Admin: admin / Admin@123');
    console.log('Users: ansh / user123, gorang / user123, priya / user123');
    console.log('Owners: john_pizza / password123, maria_sushi / password123, raj_curry / password123, sarah_burger / password123');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAllDatabase();
