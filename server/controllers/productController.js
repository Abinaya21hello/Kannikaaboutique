import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
  try {

    const frontImage = req.files["frontImage"]
      ? req.files["frontImage"][0].path
      : ""

    const hoverImage = req.files["hoverImage"]
      ? req.files["hoverImage"][0].path
      : ""

    const galleryImages = req.files["galleryImages"]
      ? req.files["galleryImages"].map(file => file.path)
      : []

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      offerPrice: req.body.offerPrice,
      stock: req.body.stock,
  sizes: req.body.sizes ? req.body.sizes.split(",") : [],

      frontImage,
      hoverImage,
      galleryImages,

      isTopCollection: req.body.isTopCollection === "true",
      isNewCollection: req.body.isNewCollection === "true"
    })

    res.status(201).json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}



export const getProducts = async (req, res) => {
  try {
    const { isNewCollection } = req.query

    let filter = {}

    if (isNewCollection) {
      filter.isNewCollection = isNewCollection === "true"
    }

    const products = await Product.find(filter)

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// ✅ GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product)
      return res.status(404).json({ message: "Product not found" })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ UPDATE PRODUCT (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!product)
      return res.status(404).json({ message: "Product not found" })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ DELETE PRODUCT (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product)
      return res.status(404).json({ message: "Product not found" })

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET FEATURED PRODUCTS (Top Collection)
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
