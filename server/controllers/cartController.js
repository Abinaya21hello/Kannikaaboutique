import Cart from "../models/Cart.js"

export const addToCart = async(req,res)=>{
  try{

    const userId = req.user._id   // 🔥 from token
    const {productId, quantity, size} = req.body

    const exist = await Cart.findOne({
      user:userId,
      product:productId
    })

    if(exist){
      exist.quantity += quantity || 1
      await exist.save()
      return res.json({message:"Cart updated"})
    }

    await Cart.create({
      user:userId,
      product:productId,
      quantity: quantity || 1,
      size
    })

    res.json({message:"Added to cart"})

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
