const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>{
        console.log("MongoDB connection error: ", err);
    });
}

module.exports = connectDB;