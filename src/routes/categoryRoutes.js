import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

// Add category (admin only)
router.post("/", verifyAdmin, createCategory);

// Get categories (public)
router.get("/", getCategories);

export default router;
