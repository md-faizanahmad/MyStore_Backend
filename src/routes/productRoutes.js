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
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyAdmin, addProduct);
router.get("/", getProducts);
router.put("/:id", verifyAdmin, updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
