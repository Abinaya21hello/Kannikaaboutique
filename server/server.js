import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"



import authRoutes from "./routes/authRoutes.js"
import carouselRoutes from "./routes/carouselRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import adminRoutes from "./routes/adminRouter.js"
import categoryRoutes from "./routes/categoryRoutes.js"



dotenv.config()

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))

const app = express()
app.use("/uploads", express.static("uploads"))


app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }))

app.use("/api/auth", authRoutes)
app.use("/api/carousel", carouselRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/products", productRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/admin", adminRoutes) // Admin auth routes
app.use("/api/categories", categoryRoutes) // Category routes





app.listen(5000, () => console.log("Server running on port 5000"))
