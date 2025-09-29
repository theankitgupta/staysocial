import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const cDB = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected successfully: ${cDB.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection FAILED:", error.message);
    process.exit(1);
  }
};

export default connectDB;