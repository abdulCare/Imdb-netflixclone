const mongoose = require('mongoose');
const { env } = require('./env');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error', err);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;
