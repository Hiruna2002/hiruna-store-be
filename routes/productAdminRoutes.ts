import { Router, Request, Response } from "express";
import Product from "../models/Product";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/", protect, admin, async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;