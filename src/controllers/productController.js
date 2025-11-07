import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const num = (v) => (v == null || v === "" ? null : Number(v));

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description = "",
      price,
      stock,
      category,
      imageUrl,
    } = req.body || {};
    const priceN = num(price);
    const stockN = num(stock);

    if (!name || priceN == null || stockN == null || !category) {
      return res.status(400).json({
        success: false,
        message: "name, price, stock, category required",
      });
    }

    const cat = await Category.findById(category);
    if (!cat)
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });

    let finalImageUrl = imageUrl;
    if (!finalImageUrl && req.file?.path) {
      const upload = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER || "MyStore",
      });
      finalImageUrl = upload.secure_url;
    }

    if (!finalImageUrl)
      return res
        .status(400)
        .json({ success: false, message: "Image required (imageUrl or file)" });

    const product = await Product.create({
      name,
      description,
      price: priceN,
      stock: stockN,
      category,
      imageUrl: finalImageUrl,
    });

    res.status(201).json({ success: true, message: "Product added", product });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch products",
        error: err.message,
      });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const { name, description, price, stock, category, imageUrl } =
      req.body || {};
    const update = {};

    if (name != null) update.name = name;
    if (description != null) update.description = description;
    if (price != null) update.price = Number(price);
    if (stock != null) update.stock = Number(stock);
    if (category != null) update.category = category;

    let finalImageUrl = imageUrl ?? existing.imageUrl;
    if (req.file?.path) {
      const upload = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER || "MyStore",
      });
      finalImageUrl = upload.secure_url;
    }
    update.imageUrl = finalImageUrl;

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("category", "name");

    res
      .status(200)
      .json({ success: true, message: "Product updated", product: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Delete failed", error: err.message });
  }
};
