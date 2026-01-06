import express, { Request, Response, Router } from "express";
import Order from "../models/Order";
import { protect } from "../middleware/authMiddleware";
import { Types } from "mongoose";

const router: Router = express.Router();


interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId | string;
  };
}


router.get("/my-orders", protect, async (req: AuthRequest, res: Response) => {
  try {
    
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const orderId = req.params.id.trim();

    if (!Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;