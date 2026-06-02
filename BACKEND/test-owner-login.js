const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const RestaurantOwner = require('./data/restaurantOwners');

dotenv.config();

const testOwnerLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        // Find all owners
        const owners = await RestaurantOwner.find({});
        console.log(`\n👥 Found ${owners.length} restaurant owners:\n`);

        for (const owner of owners) {
            console.log(`Owner: ${owner.username}`);
            console.log(`Email: ${owner.email}`);
            console.log(`Password (hashed): ${owner.password}`);
            console.log(`Restaurant ID: ${owner.restaurantId}`);
            
            // Test if password is hashed
            const isHashed = owner.password.startsWith('$2b$') || owner.password.startsWith('$2a$');
            console.log(`Is password hashed? ${isHashed ? '✅ YES' : '❌ NO (plain text)'}`);
            
            if (isHashed) {
                // Test the password
                const testPassword = 'password123';
                const isValid = await bcrypt.compare(testPassword, owner.password);
                console.log(`Test password 'password123': ${isValid ? '✅ VALID' : '❌ INVALID'}`);
            }
            console.log('---');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testOwnerLogin();
