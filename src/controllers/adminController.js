// src/controllers/adminController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in .env");
      return res
        .status(500)
        .json({ success: false, message: "Server misconfiguration" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true, // set true in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      admin: { id: admin._id, name: admin.name || "", email: admin.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ success: true, message: "Logged out" });
};
