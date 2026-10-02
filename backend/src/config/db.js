import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ${connection.connection.host}`);
  } catch (error) {
    console.log("Database connection failed");
    process.exit(1);
  }
};

export default connectDB;
