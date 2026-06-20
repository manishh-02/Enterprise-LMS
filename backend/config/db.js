const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Database successfully connect ho gaya!');
    } catch (error) {
        console.error('Database connection fail ho gaya:', error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;