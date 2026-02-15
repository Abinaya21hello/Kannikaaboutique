import express from "express"
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from "../controllers/productController.js"
import { uploadProduct } from "../middleware/uploadMiddleware.js"


import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public
router.get("/", getProducts)
router.get("/featured", getFeaturedProducts)
router.get("/:id", getProductById)

router.post(
  "/",
  protect,
  // adminOnly,
  uploadProduct.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 }
  ]),
  createProduct
)

router.put("/:id", protect, adminOnly, updateProduct)
router.delete("/:id", protect, adminOnly, deleteProduct)

export default router
