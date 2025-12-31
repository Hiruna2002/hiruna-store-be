// import mongoose from "mongoose";

// const connectDB = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected successfully");
//     } catch (err) {
//         console.error("MongoDB connection failed.", err)
//     }
// };

// module.exports = connectDB;

import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed.", err);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;
