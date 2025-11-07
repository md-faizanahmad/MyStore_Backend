import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { cookieOptions } from "../utils/cookieOptions.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions()).json({
      success: true,
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("name email");
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    res.json({
      success: true,
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const logout = async (_req, res) => {
  try {
    const opts = cookieOptions();
    res.clearCookie("token", { ...opts, maxAge: 0 });
    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
