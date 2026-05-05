import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("DB is connected"));
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;