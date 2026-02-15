import express from "express"

import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
} from "../controllers/adminController.js"

const router = express.Router()

router.post("/register", registerAdmin)
router.post("/login", loginAdmin)
router.post("/logout", logoutAdmin)
router.get("/me", getCurrentAdmin)

export default router
