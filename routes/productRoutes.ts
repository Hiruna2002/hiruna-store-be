// import express from "express";
// import Product from "../models/Product";
// import protect from "../middleware/authMiddleware";

// const router = express.Router();

// // @route POST /api/products
// // @desc Create a new Product
// // @access Private/Admin
// router.post("/",protect,async (req, res) => {
//     try{
//         const {
//             name, 
//             description, 
//             price, 
//             discountPrice, 
//             countInStock, 
//             category, 
//             brand,
//             sizes,
//             colors,
//             collections,
//             material,
//             gender,
//             images,
//             isFeatured,
//             isPublished,
//             tags,
//             dimensions,
//             weight,
//             sku,
//         } = req.body;

//         const product = new Product({
//             name, 
//             description, 
//             price, 
//             discountPrice, 
//             countInStock, 
//             category, 
//             brand,
//             sizes,
//             colors,
//             collections,
//             material,
//             gender,
//             images,
//             isFeatured,
//             isPublished,
//             tags,
//             dimensions,
//             weight,
//             sku,
//             user: req.user?._id, // Reference to the admin user who created it
//         });

//         const createdProduct = await product.save();
//         res.status(201).json(createdProduct);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server Error")
//     }
// });


import express, { Request, Response } from "express";
import Product from "../models/Product";
import { protect, admin } from "../middleware/authMiddleware";
import { IUser } from "../models/User";

interface AuthRequest extends Request {
  user?: IUser;
}

const router = express.Router();

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post(
  "/",
  protect, admin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collectionName,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku,
      } = req.body;

      const product = new Product({
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collectionName,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku,
        user: req.user?._id,
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
