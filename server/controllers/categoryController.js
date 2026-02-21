import Category from "../models/categoryModel.js";

// 🔥 ADD CATEGORY
export const createCategory = async (req,res)=>{
  try{

    const {name,slug} = req.body

    if(!name || !slug){
      return res.status(400).json({message:"Name & slug required"})
    }

    if(!req.file){
      return res.status(400).json({message:"Image required"})
    }

    // image path
    const image = req.file.path   // uploads/categories/xxx.jpg

    // check slug duplicate
    const exist = await Category.findOne({slug})
    if(exist){
      return res.status(400).json({message:"Slug already exists"})
    }

    const category = new Category({
      name,
      slug,
      image
    })

    await category.save()

    res.status(201).json({
      success:true,
      message:"Category created successfully",
      category
    })

  }catch(err){
    res.status(500).json({message:err.message})
  }
};



export const getAllCategories = async(req,res)=>{
  try{
    const categories = await Category.find().sort({createdAt:-1})
    res.json(categories)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}



export const getProductsByCategorySlug = async(req,res)=>{
  try{
    const {slug} = req.params

    const category = await Category.findOne({slug})
    if(!category){
      return res.status(404).json({message:"Category not found"})
    }

    const products = await Product.find({
      category: category._id
    }).populate("category","name slug image")

    res.json(products)

  }catch(err){
    res.status(500).json({message:err.message})
  }
}
