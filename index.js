// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import serverless from "serverless-http";
import connectDB from "./src/config/db.js";
// Import routes
import adminRoutes from "./src/routes/adminRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

dotenv.config();
connectDB();
const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());

// Allow both frontend local + vercel domain
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://my-store-frontend.vercel.app", // change later to actual frontend domain
    ],
    credentials: true,
  })
);

// ===== DATABASE CONNECTION =====
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== ROUTES =====
app.use("/mystoreapi/admin", adminRoutes);
app.use("/mystoreapi/categories", categoryRoutes);
app.use("/mystoreapi/products", productRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("MyStore API is running 🚀");
});

// ===== LOCAL SERVER SETUP =====
const PORT = process.env.PORT || 3000;

// Detect if running locally or in serverless (Vercel)
if (process.env.VERCEL) {
  // In Vercel deployment, do NOT listen manually
  console.log("⚙️ Running in Vercel (Serverless mode)");
} else {
  // Local mode
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ===== EXPORT FOR VERCEL =====
export const handler = serverless(app);
export default app;
