import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoustes";
import subscriberRoutes from "./routes/subscriberRoutes";
import authRoutes from "./routes/userRoutes";

import adminRoutes from "./routes/adminRoutes";
import productAdminRoutes from "./routes/productAdminRoutes";
import adminOrderRoutes from "./routes/adminOrderRoutes";


const app: Application = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// connect mongodb 
connectDB();

app.get("/", (req: Request, res: Response): void => {
  res.send("WELCOME TO HIRUNA STORE API!");
});

// Api Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/api/auth", authRoutes);

// Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
