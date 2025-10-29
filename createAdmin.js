import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./src/models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // delete any existing admins
    await Admin.deleteMany({});
    console.log("🧹 Old admins removed");

    // no manual hashing here — let the pre-save hook do it
    const newAdmin = await Admin.create({
      name: "Md Ahmad",
      email: "admin@mystore.com",
      username: "admin_mystore",
      password: "admin123", // plain text; model will hash
    });

    console.log("✅ Admin created successfully:");
    console.log({
      username: newAdmin.username,
      password: "admin123 (hashed in DB by model)",
      email: newAdmin.email,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
