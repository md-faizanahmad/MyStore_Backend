import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ DB Connection
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
