import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🟢 Admin Register (run once to create admin)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔐 Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin", email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📊 Admin Dashboard Stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({ totalUsers, totalCategories, totalProducts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: err.message });
  }
};
