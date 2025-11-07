// import express from "express";
// import multer from "multer";
// import { verifyAdmin } from "../middlewares/verifyAdmin.js";
// import {
//   addProduct,
//   getProducts,
//   updateProduct,
//   deleteProduct,
// } from "../controllers/productController.js";

// const router = express.Router();

// // ✅ Multer config for file upload
// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// // Routes
// router.post("/", verifyAdmin, upload.single("image"), addProduct);
// router.get("/", getProducts);
// router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
// router.delete("/:id", verifyAdmin, deleteProduct);

// export default router;
//////////////////////////////////////////////
import express from "express";
import multer from "multer";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const upload = multer({ dest: "/tmp" }); // works on Vercel

const router = express.Router();

router.get("/", getProducts);
router.post("/", verifyAdmin, upload.single("image"), addProduct);
router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
