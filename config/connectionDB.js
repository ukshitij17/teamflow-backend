const mongoose = require('mongoose');


const connectDB = async()=> {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Successfully connected to MongoDB via Mongoose!");
    console.log(mongoose.connection.name)
    console.log(mongoose.connection.readyState)
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;