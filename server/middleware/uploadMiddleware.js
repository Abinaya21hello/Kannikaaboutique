import multer from "multer"
import path from "path"
import fs from "fs"

// Ensure folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Carousel Storage
const carouselStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/carousel"
    ensureDir(dir)
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

// Product Storage
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/products"
    ensureDir(dir)
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

export const uploadCarousel = multer({ storage: carouselStorage })
export const uploadProduct = multer({ storage: productStorage })
