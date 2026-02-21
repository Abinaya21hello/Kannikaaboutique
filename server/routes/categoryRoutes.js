import express from "express"
import {createCategory,getAllCategories} from "../controllers/categoryController.js"
import {uploadCategory} from "../middleware/uploadMiddleware.js"

const router = express.Router()

// POST category (slug + image)
router.post("/add", uploadCategory.single("image"), createCategory)

// GET categories
router.get("/all", getAllCategories)

export default router
