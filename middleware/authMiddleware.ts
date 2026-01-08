// import { Jwt } from "jsonwebtoken";
// import User from "../models/User";

// // Middleware to protect routes
// const protect = async (req, res, next) => {
//     let token;

//     if(
//         req.headers.authorization &&
//         reqheaders.authorization.startsWith("Bearer")
//     ) {
//         try{
//             token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             req.user = await User.findById(decoded.user.id).select("-password");
//             next();
//         } catch (error) {
//             console.error("Token verification failed:", error);
//             resizeBy.status(401).json({ message: "Not authorized, token failed"})
//         }
//     } else {
//         res.status(401).json({message: "Not authorized, no token proided"});
//     }
// };

// export default protect;

// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import User, { IUser } from "../models/User";

// // Extend Express Request to include user
// interface AuthenticatedRequest extends Request {
//   user?: IUser;
// }

// export interface AuthRequest extends Request {
//   user?: {
//     _id: string;
//     name: string;
//     email: string;
//     role: "admin" | "customer";
//   };
// }

// // Middleware to protect routes
// const protect = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   let token: string | undefined;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       if (!process.env.JWT_SECRET) {
//         throw new Error("JWT_SECRET is not defined");
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

//       req.user = await User.findById(decoded.user.id).select("-password");
//       next();
//     } catch (error) {
//       console.error("Token verification failed:", error);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token provided" });
//   }
// };

// -------------------------------------------------------------------

//  Middleware to check if the user is an admin
// const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next()
//   } else {
//     res.status(403).json({message: "Not authorized as an admin"})
//   }
// } 

// -------------------------------------------------------------------

// const admin = (req: Request, res: Response, next: NextFunction): void => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as an admin" });
//   }
// };

// export {protect, admin};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "customer";
  };
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

      const user = await User.findById(decoded.user.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("User role:", req.user?.role);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export { protect, admin };


