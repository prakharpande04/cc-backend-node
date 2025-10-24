// MongoDB connection using Mongoose
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      // useNewUrlParser, useUnifiedTopology are defaults in mongoose 7+
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
