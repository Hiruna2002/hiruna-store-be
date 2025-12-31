// import express from "express";
// import User from "../models/User";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// // @route POST /api/users/register
// // @desc Register a new user
// // @access Public
// router.post("/register", async(req,res) => {
//     const { name, email, password } = req.body;

//     try{
//         //Registration logic
//         let user = await User.findOne({ email });

//         if (user) return res.status(400).json({ message: "User already exists" });

//         user = new User({ name, email, password});
//         await user.save();

//         // create jwt payload

//         const payload = {user: {id:user._id, role: user.role }};

//         // sign and return the token along with user data
//         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h"}, (err, token) => {
//             if(err) throw err;

//             // send the user and token in response
//             res.status(201).json({
//                 user: {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                 },
//                 token,
//             })
//         })

//     } catch (error){
//         console.log(error);
//         res.status(500).send("Server Error");
//     }
// });

// module.exports = router;


import express, { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import {protect, admin} from "../middleware/authMiddleware";


const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    try {
      // Check if user exists
      let user: IUser | null = await User.findOne({ email });

      if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      // Create user
      user = new User({ name, email, password });
      await user.save();

      // JWT payload
      const payload: JwtPayload = {
        user: {
          id: user._id.toString(),
          role: user.role,
        },
      };

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const signOptions: SignOptions = {
        expiresIn: "40h",
      };

      // Sign JWT
      const token = jwt.sign(payload, process.env.JWT_SECRET, signOptions);

      // Response
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    console.log("password is to: ", password);

     

    try {
      // Find user by email
      const user: IUser | null = await User.findOne({ email }).select("+password");
      console.log("Password is:" , password)

      if (!user) {
        res.status(400).json({ message: "user - Invalid credentials" });
        return;
      }

     console.log("Fetched password:", user.password); ///////////// ok

      // Match password
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        res.status(400).json({ message: "passowrd - Invalid credentials" });
        return;
      }

      // Check JWT secret
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      // JWT payload
      const payload = {
        user: {
          id: user._id.toString(),
          role: user.role,
        },
      };

      const options: SignOptions = {
        expiresIn: "40h",
      };

      // Generate token
      const token = jwt.sign(payload, process.env.JWT_SECRET, options);

      // Success response
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET /api/users/progile
// @desc Get logged-in user's profile [Protected Route]
// @access Private

interface AuthenticatedRequest extends Request {
  user?: IUser; // user will be attached by `protect` middleware
}

router.get(
    "/profile", 
    protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  res.json(req.user);
});


export default router;