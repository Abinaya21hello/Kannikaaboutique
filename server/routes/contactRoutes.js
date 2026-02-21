import express from "express"
import {
  addSubscriber,
  getSubscribers,
  getContactInfo,
  updateContactInfo
} from "../controllers/contactController.js"

// import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public
router.post("/subscribe", addSubscriber)
router.get("/info", getContactInfo)

// Admin
router.get("/subscribers", getSubscribers)
router.put("/info", updateContactInfo)

export default router
