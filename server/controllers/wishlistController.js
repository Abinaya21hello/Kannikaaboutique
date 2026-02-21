import Wishlist from "../models/Wishlist.js"

export const addWishlist = async(req,res)=>{
  try{

    const userId = req.user._id
    const {productId} = req.body

    const exist = await Wishlist.findOne({
      user:userId,
      product:productId
    })

    if(exist){
      return res.json({message:"Already in wishlist"})
    }

    await Wishlist.create({
      user:userId,
      product:productId
    })

    res.json({message:"Added to wishlist"})

  }catch(err){
    res.status(500).json({message:err.message})
  }
}



export const getWishlist = async(req,res)=>{
  try{

    const userId = req.user._id

    const items = await Wishlist.find({user:userId})
      .populate("product")

    res.json(items)

  }catch(err){
    res.status(500).json({message:err.message})
  }
}
