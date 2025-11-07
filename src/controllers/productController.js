// import Product from "../models/Product.js";
// import Category from "../models/Category.js";
// import cloudinary from "cloudinary";

// // ✅ Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Add Product
// export const addProduct = async (req, res) => {
//   const { name, description, price, category, stock } = req.body;
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Image required" });
//     }

//     const catExists = await Category.findById(category);
//     if (!catExists) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" });
//     }

//     const result = await cloudinary.v2.uploader.upload(req.file.path, {
//       folder: process.env.CLOUDINARY_FOLDER || "MyStore_Products",
//     });

//     const product = await Product.create({
//       name,
//       description,
//       price,
//       category,
//       stock,
//       imageUrl: result.secure_url,
//     });

//     res.status(201).json({ success: true, message: "Product added", product });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: err.message });
//   }
// };

// // ✅ Get All Products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("category", "name");
//     res.status(200).json({ success: true, products });
//   } catch (err) {
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Failed to fetch products",
//         error: err.message,
//       });
//   }
// };

// // ✅ Update Product
// export const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const existing = await Product.findById(id);
//     if (!existing)
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });

//     let imageUrl = existing.imageUrl;

//     if (req.file) {
//       const result = await cloudinary.v2.uploader.upload(req.file.path, {
//         folder: process.env.CLOUDINARY_FOLDER || "MyStore_Products",
//       });
//       imageUrl = result.secure_url;
//     }

//     const updated = await Product.findByIdAndUpdate(
//       id,
//       { ...req.body, imageUrl },
//       { new: true }
//     );

//     res
//       .status(200)
//       .json({ success: true, message: "Product updated", product: updated });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ success: false, message: "Update failed", error: err.message });
//   }
// };

// // ✅ Delete Product
// export const deleteProduct = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findByIdAndDelete(id);
//     if (!product)
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     res.status(200).json({ success: true, message: "Product deleted" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ success: false, message: "Delete failed", error: err.message });
//   }
// };
////////////////////////////////////////////////

import Product from "../models/Product.js";
import Category from "../models/Category.js";

// ✅ Create Product (expects imageUrl from frontend)
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description = "",
      price,
      stock,
      category,
      imageUrl,
    } = req.body;

    // Basic validation
    if (!name || price == null || stock == null || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "name, price, stock, category, imageUrl are required",
      });
    }
    if (Number.isNaN(Number(price)) || Number.isNaN(Number(stock))) {
      return res.status(400).json({
        success: false,
        message: "price and stock must be numbers",
      });
    }

    // Validate category
    const cat = await Category.findById(category);
    if (!cat) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl, // 🔑 comes from FE (Cloudinary secure_url)
    });

    return res
      .status(201)
      .json({ success: true, message: "Product added", product });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ Get All Products
export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, products });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

// ✅ Update Product (imageUrl optional)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, imageUrl } = req.body;

    const existing = await Product.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const update = {};
    if (name != null) update.name = name;
    if (description != null) update.description = description;
    if (price != null) {
      if (Number.isNaN(Number(price))) {
        return res
          .status(400)
          .json({ success: false, message: "price must be a number" });
      }
      update.price = Number(price);
    }
    if (stock != null) {
      if (Number.isNaN(Number(stock))) {
        return res
          .status(400)
          .json({ success: false, message: "stock must be a number" });
      }
      update.stock = Number(stock);
    }
    if (category != null) {
      const cat = await Category.findById(category);
      if (!cat) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      }
      update.category = category;
    }
    if (imageUrl) update.imageUrl = imageUrl; // optional change

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("category", "name");

    return res
      .status(200)
      .json({ success: true, message: "Product updated", product: updated });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Delete failed", error: err.message });
  }
};
