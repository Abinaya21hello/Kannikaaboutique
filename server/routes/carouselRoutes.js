import express from "express"
import {
  createCarousel,
  getCarousels,
  getCarouselById,
  updateCarousel,
  deleteCarousel
} from "../controllers/carouselController.js"
import { protect } from "../middleware/authMiddleware.js"
import { uploadCarousel } from "../middleware/uploadMiddleware.js"
import carousels from "../models/Carousel.js"


const router = express.Router()

router.route("/")
    .post(protect, uploadCarousel.single("image"), createCarousel)
  .get(getCarousels)

router.route("/:id")
  .get(getCarouselById)
  .put(protect, updateCarousel)
  .delete(protect, deleteCarousel)


 


export default router
