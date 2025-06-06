import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error(`Error while connecting db`);
    }
}

export default connectDB;