import { Router, Request, Response } from "express";
import User from "../models/User";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/", protect, admin, async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", protect, admin, async (req: Request, res: Response) => {
    const{name,email,password,role} = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res
            .status(400)
            .json({ message: "User already exists" });
        }
        user = new User({ 
            name, 
            email, 
            password, 
            role: role || "customer"
        });
        await user.save();
        res.status(201).json({ message: "User created successfully" });


    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }
});


// router.put("/:id", protect, admin, async (req: Request, res: Response) => {
//     try{
//         const user = await User.findById(req.params.id);

//         if(user){
//             user.name = req.body.name || user.name;
//             user.email = req.body.email || user.email;
//             user.role = req.body.role || user.role;
//         }
//         const updatedUser = await user.save();
//         res.json({message:"User updated successfully", user: updatedUser});
//     }catch (error) {
//         console.error(error)
//         res.status(500).json({ message: "Server error" });

//     }
// });

router.put(
  "/:id",
  protect,
  admin,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.delete("/:id", protect, admin, async (req: Request, res: Response) => {
    try{
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message: "User removed successfully"});
        }else{
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" });
    }
})


export default router;