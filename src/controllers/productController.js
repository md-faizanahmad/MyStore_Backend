import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "MyStore",
    });

    const product = new Product({
      name,
      description,
      price,
      category,
      image: result.secure_url,
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "MyStore",
      });
      updates.image = result.secure_url;
    }

    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
