import express from "express";
import multer from "multer";

import adminAuth from "../middleware/adminAuth.js";
import {
  listProduct,
  addProduct,
  importFrontendProducts,
  removeProduct,
  singleProduct,
  updateProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

// multer config
const storage = multer.diskStorage({});
const upload = multer({ storage });

// admin routes
productRouter.post(
  "/add",
  adminAuth,
  upload.array("images"),
  addProduct
);

productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/import-frontend", adminAuth, importFrontendProducts);
productRouter.post("/update", adminAuth, updateProduct);

// public routes
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);

export default productRouter;
