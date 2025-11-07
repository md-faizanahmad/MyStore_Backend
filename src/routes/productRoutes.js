import express from "express";
import { verifyAdminCookie } from "../middlewares/verifyAdmin.js";
import upload from "../middlewares/upload.js";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

// Option A: FE uploads to Cloudinary → send imageUrl (no multer needed)
router.post("/", verifyAdminCookie, addProduct);

// Option B: FE sends multipart with "image" → backend uploads (multer memory)
router.post("/upload", verifyAdminCookie, upload.single("image"), addProduct);

router.put("/:id", verifyAdminCookie, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdminCookie, deleteProduct);

export default router;
