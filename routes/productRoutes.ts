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
  async (req: AuthRequest, res: Response) => {
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
        collections,
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
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku,
        user: req.user!._id,
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// @route PUT /api/products:id
// @desc update an exiting product ID
// @access private/Admin
router.put("/:id", protect, admin, async (req: Request, res: Response): Promise<void> => {
    try{
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
        collections,
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

      // Find product by ID
      const product = await Product.findById(req.params.id);

      if(product) {
        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.countInStock = countInStock || product.countInStock;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes = sizes || product.sizes;
        product.colors = colors || product.colors;
        product.collections = collections || product.collections;
        product.material = material || product.material;
        product.gender = gender || product.gender;
        product.images = images || product.images;
        product.isFeatured = 
            isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.isPublished 
            isPublished !== undefined ? isPublished : product.isPublished;
        product.tags = tags || product.tags;
        product.dimensions = dimensions || product.dimensions;
        product.weight = weight || product.weight;
        product.sku = sku || product.sku;

        // save the updated product
        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404).json({message: "Product not found"});
      }
    }catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route DELETE /api/products/:is
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req: Request, res: Response): Promise<void> => {
    try{
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (product) {
            // Remove the product from DB
            await product.deleteOne();
            res.json({message: "Product removed"});
        } else {
            res.status(500).send({message: "Product not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      collections,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      search,
      sortBy,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query: any = {};
    let sort: any = {};

    if (collections && collections !== "all") {
      query.collections = collections;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: (material as string).split(",") };
    }

    if (brand) {
      query.brand = { $in: (brand as string).split(",") };
    }

    if (size) {
      query.sizes = { $in: (size as string).split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }


    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          sort = {};
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/best-sellers", async (req: Request, res: Response) => {
  try {
    const bestSellers = await Product.findOne().sort({rating:-1});
    if(bestSellers){
      res.json(bestSellers);
    }else{
      res.status(404).json({message:"No best seller found"})
    }
  }catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/new-arrivals", async (req: Request, res: Response) => {
  try {
    const newArrivals = await Product.find().sort({createdAt:-1}).limit(8);
    res.json(newArrivals);
  }catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/similar/:id", async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

export default router;
