import express from "express"
import {addWishlist,getWishlist} from "../controllers/wishlistController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, addWishlist)
router.get("/", protect, getWishlist)

export default router
