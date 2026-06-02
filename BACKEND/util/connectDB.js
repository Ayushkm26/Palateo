const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async ()=>{
    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri || !mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MONGO_URI. Set it to a value starting with mongodb:// or mongodb+srv://');
    }

    await mongoose.connect(mongoUri).then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>{
        console.log("MongoDB connection error: ", err);
    });
}

module.exports = connectDB;
