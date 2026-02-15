import express from "express"
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
} from "../controllers/cartController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Protect all routes
router.use(protect)

// Add to cart
router.post("/", addToCart)

// Get cart items
router.get("/", getCart)

// Update quantity
router.put("/:id", updateCartQuantity)

// Remove item
router.delete("/:id", removeFromCart)

export default router
