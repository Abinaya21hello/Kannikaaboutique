import Wishlist from "../models/Wishlist.js"

// Add
export const addToWishlist = async (req, res) => {
  const { productId } = req.body

  const exists = await Wishlist.findOne({
    user: req.user._id,
    product: productId
  })

  if (exists)
    return res.status(400).json({ message: "Already in wishlist" })

  const item = await Wishlist.create({
    user: req.user._id,
    product: productId
  })

  res.status(201).json(item)
}

// Get
export const getWishlist = async (req, res) => {
  const items = await Wishlist.find({
    user: req.user._id
  }).populate("product")

  res.json(items)
}

// Remove
export const removeFromWishlist = async (req, res) => {
  await Wishlist.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  })

  res.json({ message: "Removed from wishlist" })
}
