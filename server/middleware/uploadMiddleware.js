import multer from "multer"
import fs from "fs"

// Ensure folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

//////////////////// CAROUSEL ////////////////////
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

//////////////////// PRODUCT ////////////////////
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

//////////////////// CATEGORY ////////////////////
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/categories"
    ensureDir(dir)
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

export const uploadCarousel = multer({ storage: carouselStorage })
export const uploadProduct = multer({ storage: productStorage })
export const uploadCategory = multer({ storage: categoryStorage }) // ✅ new
