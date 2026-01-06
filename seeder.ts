import mongoose from "mongoose";
import dotenv from "dotenv";
import Product, { IProduct } from "./models/Product";
import User, { IUser } from "./models/User";
import Cart from "./models/Cart";
// import { products } from "./data/products";

dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const seedData = async (): Promise<void> => {
  try {
   
    await Product.deleteMany({});
    await User.deleteMany({});
    await Cart.deleteMany({});

    const createUser: IUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    const userId = createUser._id;

    const products: IProduct[] = [];
   
    const sampleProducts: IProduct[] = products.map((product) => ({
        ...product,
        user:userId,
    })) as unknown as IProduct[]; 

    await Product.insertMany(sampleProducts);

    console.log("Data Seeded Successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();