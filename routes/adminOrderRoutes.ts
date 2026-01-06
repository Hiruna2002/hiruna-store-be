import { Router, Request, Response } from "express";
import Order from "../models/Order";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/", protect, admin, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", protect, admin, async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("user","name");

    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Delivered" ? new Date() : order.deliveredAt;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/:id",protect,admin,async (req,res) => {
    try{
        const order = await Order.findById(req.params.id)
        if(order){
            await order.deleteOne()
            res.json({message:"Order Removed"})
        }else{
            res.status(404).json({message: "Order not found"})
        }
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})


export default router;