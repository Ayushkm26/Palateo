const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Admin = require('./data/admins');

dotenv.config();

const testAdminLogin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        // Find admin
        const admin = await Admin.findOne({ username: 'admin' });
        
        if (!admin) {
            console.log('❌ Admin not found in database');
            process.exit(1);
        }

        console.log('\n✅ Admin found:');
        console.log('Username:', admin.username);
        console.log('Email:', admin.email);
        console.log('Role:', admin.role);
        console.log('ID:', admin.id);
        console.log('Password hash:', admin.password);

        // Test password
        const testPassword = 'Admin@123';
        const isValid = await bcrypt.compare(testPassword, admin.password);
        
        console.log('\n🔐 Password Test:');
        console.log('Testing password:', testPassword);
        console.log('Password valid:', isValid ? '✅ YES' : '❌ NO');

        if (isValid) {
            console.log('\n✅ Login credentials are correct!');
            console.log('Username: admin');
            console.log('Password: Admin@123');
        } else {
            console.log('\n❌ Password does not match!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testAdminLogin();
