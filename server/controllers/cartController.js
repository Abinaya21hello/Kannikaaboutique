import Cart from "../models/Cart.js"

// Add to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body

  const existing = await Cart.findOne({
    user: req.user._id,
    product: productId
  })

  if (existing) {
    existing.quantity += quantity
    await existing.save()
    return res.json(existing)
  }

  const cartItem = await Cart.create({
    user: req.user._id,
    product: productId,
    quantity
  })

  res.status(201).json(cartItem)
}

// Get cart
export const getCart = async (req, res) => {
  const items = await Cart.find({
    user: req.user._id
  }).populate("product")

  res.json(items)
}

// Update quantity
export const updateCartQuantity = async (req, res) => {
  const { quantity } = req.body

  const item = await Cart.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { quantity },
    { new: true }
  )

  res.json(item)
}

// Remove from cart
export const removeFromCart = async (req, res) => {
  await Cart.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  })

  res.json({ message: "Removed from cart" })
}
