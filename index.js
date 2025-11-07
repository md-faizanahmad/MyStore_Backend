// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import serverless from "serverless-http";

import adminRoutes from "./src/routes/adminRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

dotenv.config();

const app = express();

// --- core middleware ---
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://my-store-admin-five.vercel.app", // your FE live domain (change if different)
    ],
    credentials: true,
  })
);

// --- db connect ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in env");
}
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// --- routes base ---
app.use("/mystoreapi/admin", adminRoutes);
app.use("/mystoreapi/categories", categoryRoutes);
app.use("/mystoreapi/products", productRoutes);

app.get("/", (_req, res) => {
  res.send("MyStore API is running 🚀");
});

// --- server (local) vs serverless (vercel) ---
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export const handler = serverless(app);
export default app;
