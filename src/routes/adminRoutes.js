import express from "express";
import { login, me, logout } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", verifyAdmin, me);
router.post("/logout", verifyAdmin, logout);

export default router;
