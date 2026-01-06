// const express = require("express");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const PORT = 9000;

// app.get("/", (req,res) => {
//     res.send("WELCOME TO HIRUNA STORE API!");
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";


const app: Application = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// connect mongodb 
connectDB();

app.get("/", (req: Request, res: Response): void => {
  res.send("WELCOME TO HIRUNA STORE API!");
});

// Api Routse
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes);

app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
