import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getStats,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/stats", verifyAdmin, getStats);

export default router;
