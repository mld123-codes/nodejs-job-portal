const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Server successfully connected to ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`MongoDB Error${error}`.bgRed.white);
  }
};

module.exports = connectDB;
