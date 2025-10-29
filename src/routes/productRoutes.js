import express from "express";
import upload from "../middlewares/upload.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add", verifyAdmin, upload.single("image"), addProduct);
router.get("/", getProducts);
router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
