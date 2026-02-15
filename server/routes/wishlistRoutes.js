import express from "express"
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from "../controllers/wishlistController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// All routes protected
router.use(protect)

// Add product to wishlist
router.post("/", addToWishlist)

// Get user's wishlist
router.get("/", getWishlist)

// Remove product from wishlist
router.delete("/:id", removeFromWishlist)

export default router
