const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./data/blogs');

dotenv.config();

const checkBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        const blogs = await Blog.find({});
        console.log(`\n📚 Total blogs in database: ${blogs.length}\n`);
        
        if (blogs.length === 0) {
            console.log('❌ No blogs found in database!');
        } else {
            console.log('✅ Blogs found:');
            blogs.forEach((blog, index) => {
                console.log(`\n${index + 1}. ${blog.title}`);
                console.log(`   ID: ${blog.id}`);
                console.log(`   Author: ${blog.author}`);
                console.log(`   Category: ${blog.category}`);
                console.log(`   Date: ${blog.date}`);
                console.log(`   Tags: ${blog.tags?.join(', ') || 'None'}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkBlogs();
