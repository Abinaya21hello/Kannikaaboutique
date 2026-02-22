import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

export const addToCart = async(req,res)=>{
  try{

    const userId = req.user._id
    let {productId, quantity, size} = req.body

    quantity = Number(quantity)

    // ❌ quantity check
    if(!quantity || quantity <= 0){
      return res.status(400).json({
        message:"Quantity must be at least 1"
      })
    }

    // 🔥 product check
    const product = await Product.findById(productId)
    if(!product){
      return res.status(404).json({message:"Product not found"})
    }

    // ❌ stock check
    if(quantity > product.stock){
      return res.status(400).json({
        message:`Only ${product.stock} items available`
      })
    }

    // 🔥 check already in cart (same product + same size)
    const exist = await Cart.findOne({
      user:userId,
      product:productId,
      size:size
    })

    if(exist){
      return res.status(400).json({
        message:"Product already added in cart"
      })
    }

    // 🔥 create new cart item
    const cartItem = await Cart.create({
      user:userId,
      product:productId,
      quantity,
      size
    })

    res.json({
      message:"Added to cart successfully",
      cart:cartItem
    })

  }catch(err){
    res.status(500).json({message:err.message})
  }
}



export const getCart = async(req,res)=>{
  try{

    const userId = req.user._id

    const cart = await Cart.find({user:userId})
      .populate("product")

    res.json(cart)

  }catch(err){
    res.status(500).json({message:err.message})
  }
}


// cartController.js - Add these functions

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be at least 1"
      });
    }

    const cartItem = await Cart.findOne({
      _id: id,
      user: userId
    }).populate('product');

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Check stock
    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        message: `Only ${cartItem.product.stock} items available`
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      message: "Cart updated successfully",
      cart: cartItem
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const cartItem = await Cart.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({
      message: "Item removed from cart successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.deleteMany({ user: userId });

    res.json({
      message: "Cart cleared successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};