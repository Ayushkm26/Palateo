const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

// Import models
const RestaurantOwner = require('./data/restaurantOwners');
const Restaurant = require('./data/restaurants');
const Menu = require('./data/menus');
const Blog = require('./data/blogs');
const Admin = require('./data/admins');

const SALT_ROUNDS = 10;

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');

        // Read sample data
        const sampleData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'sample-data.json'), 'utf-8')
        );

        // Clear existing data FIRST
        console.log('Clearing existing data...');
        await RestaurantOwner.deleteMany({});
        await Restaurant.deleteMany({});
        await Menu.deleteMany({});
        await Blog.deleteMany({});
        await Admin.deleteMany({});
        console.log('Existing data cleared');

        // Insert Admin
        console.log('Inserting admin...');
        const adminWithHashedPassword = await bcrypt.hash('Admin@123', SALT_ROUNDS);
        const adminToInsert = {
            id: 1,
            username: sampleData.admins[0].username,
            email: sampleData.admins[0].email,
            password: adminWithHashedPassword,
            role: sampleData.admins[0].role,
            createdAt: new Date(),
            lastLogin: null
        };
        const insertedAdmin = await Admin.create(adminToInsert);
        console.log(`✅ Admin inserted`);

        // Insert Restaurants first
        console.log('Inserting restaurants...');
        const restaurantsToInsert = sampleData.restaurants.map((restaurant, index) => ({
            id: String(index + 1),
            name: restaurant.name,
            image: restaurant.image,
            categories: [restaurant.cuisine],
            rating: restaurant.rating,
            deliveryTime: restaurant.deliveryTime,
            address: restaurant.location,
            cuisine: restaurant.cuisine,
            isOpen: restaurant.isOpen,
            hasFreeDelivery: false,
            minOrder: 10,
            description: restaurant.description
        }));
        const insertedRestaurants = await Restaurant.insertMany(restaurantsToInsert);
        console.log(`✅ ${insertedRestaurants.length} restaurants inserted`);

        // Insert Restaurant Owners with hashed passwords and link to restaurants
        console.log('Inserting restaurant owners...');
        const ownersWithHashedPasswords = await Promise.all(
            sampleData.restaurantowners.map(async (owner, index) => {
                const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
                const restaurant = insertedRestaurants.find(r => r.name === owner.restaurantName);
                return {
                    id: uuidv4(),
                    username: owner.username,
                    email: owner.email,
                    password: hashedPassword,
                    restaurantId: restaurant ? parseInt(restaurant.id) : index + 1
                };
            })
        );
        const insertedOwners = await RestaurantOwner.insertMany(ownersWithHashedPasswords);
        console.log(`✅ ${insertedOwners.length} restaurant owners inserted`);

        // Insert Menus with restaurant IDs
        console.log('Inserting menus...');
        const menusWithRestaurantIds = sampleData.menus.map((menu) => {
            const restaurant = insertedRestaurants.find(r => r.name === menu.restaurantName);
            if (restaurant) {
                return {
                    restaurantId: restaurant.id,
                    items: menu.items.map((item, index) => ({
                        id: String(index + 1),
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        type: item.category,
                        description: item.description,
                        rating: 4.5
                    }))
                };
            }
            return null;
        }).filter(m => m !== null);
        
        const insertedMenus = await Menu.insertMany(menusWithRestaurantIds);
        console.log(`✅ ${insertedMenus.length} menus inserted`);

        // Insert Blogs
        console.log('Inserting blogs...');
        const blogsToInsert = sampleData.blogs.map(blog => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            author: blog.author,
            date: new Date(blog.date),
            category: blog.category,
            img: blog.img,
            tags: blog.tags
        }));
        const insertedBlogs = await Blog.insertMany(blogsToInsert);
        console.log(`✅ ${insertedBlogs.length} blogs inserted`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Sample Login Credentials:');
        console.log('\n👑 ADMIN:');
        console.log('  - Username: admin');
        console.log('  - Password: Admin@123');
        console.log('  - Email: admin@restaurant.com');
        console.log('\n🍽️  Restaurant Owners:');
        console.log('  - Username: john_pizza | Password: password123');
        console.log('  - Username: maria_sushi | Password: password123');
        console.log('  - Username: raj_curry | Password: password123');
        console.log('  - Username: sarah_burger | Password: password123');
        console.log('\n💡 You can now login and manage the system!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
