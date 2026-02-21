import express from "express"
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategorySlug
} from "../controllers/productController.js"

import { uploadProduct } from "../middleware/uploadMiddleware.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// PUBLIC
router.get("/", getProducts)
router.get("/featured", getFeaturedProducts)

// 🔥 IMPORTANT: CATEGORY ROUTE FIRST
router.get("/category/:slug", getProductsByCategorySlug)

// SINGLE PRODUCT
router.get("/:id", getProductById)

// CREATE PRODUCT
router.post(
  "/",
  protect,
  uploadProduct.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 }
  ]),
  createProduct
)

// UPDATE DELETE
router.put("/:id", protect,  updateProduct)
router.delete("/:id", protect, deleteProduct)

export default router
