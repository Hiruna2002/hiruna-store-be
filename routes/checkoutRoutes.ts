import express, { Request, Response } from "express";
import Checkout from "../models/Checkout";
import Cart from "../models/Cart";
import Order from "../models/Order";
import { protect, AuthRequest } from "../middleware/authMiddleware";
import { Types } from "mongoose";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", protect, async (req: AuthRequest, res: Response) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const mappedCheckoutItems = checkoutItems.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: Number(item.quantity), 
    }));

    const newCheckout = await Checkout.create({
      user: req.user!._id,
      checkoutItems: mappedCheckoutItems,
      shippingAddress : {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
      isFinalized: false,
    });

    console.log(`Checkout created for user: ${req.user!._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id/pay", protect, async (req: AuthRequest, res: Response) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    console.log("ID:", req.params.id);
    console.log("BODY:", req.body);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid checkout ID" });
    }

    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = new Date();

      await checkout.save();
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/:id/finalize", protect, async (req: AuthRequest, res: Response) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    const orderItems = checkout.checkoutItems.map(item => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
    }));

    const finalOrder = await Order.create({
      user: checkout.user as Types.ObjectId,
      orderItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
    });

    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();
    await checkout.save();

    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json(finalOrder);
  } catch (error) {
    console.error("Error finalizing checkout:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;