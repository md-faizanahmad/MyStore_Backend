import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

// helper: upload buffer (multer memory) to cloudinary
async function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// Create product
export async function addProduct(req, res) {
  try {
    const {
      name,
      description = "",
      price,
      stock,
      category,
      imageUrl,
    } = req.body;

    if (!name || price == null || stock == null || !category) {
      return res
        .status(400)
        .json({
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

    // if no imageUrl but file exists (multipart), upload via Cloudinary
    if (!finalImageUrl && req.file?.buffer) {
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return res
          .status(500)
          .json({ success: false, message: "Cloudinary env missing" });
      }
      const folder = process.env.CLOUDINARY_FOLDER || "MyStore";
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, folder);
      finalImageUrl = uploaded.secure_url;
    }

    if (!finalImageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Image required" });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl: finalImageUrl,
    });

    return res
      .status(201)
      .json({ success: true, message: "Product added", product });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

// Get products
export async function getProducts(_req, res) {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch products",
        error: err.message,
      });
  }
}

// Update product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const update = {};
    const { name, description, price, stock, category, imageUrl } = req.body;

    if (name != null) update.name = name;
    if (description != null) update.description = description;
    if (price != null) {
      if (Number.isNaN(Number(price)))
        return res
          .status(400)
          .json({ success: false, message: "price must be number" });
      update.price = Number(price);
    }
    if (stock != null) {
      if (Number.isNaN(Number(stock)))
        return res
          .status(400)
          .json({ success: false, message: "stock must be number" });
      update.stock = Number(stock);
    }
    if (category != null) {
      const cat = await Category.findById(category);
      if (!cat)
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      update.category = category;
    }

    let finalImageUrl = imageUrl ?? existing.imageUrl;
    if (!imageUrl && req.file?.buffer) {
      const folder = process.env.CLOUDINARY_FOLDER || "MyStore";
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, folder);
      finalImageUrl = uploaded.secure_url;
    }
    update.imageUrl = finalImageUrl;

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("category", "name");
    return res.json({
      success: true,
      message: "Product updated",
      product: updated,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
}

// Delete product
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    return res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Delete failed", error: err.message });
  }
}
