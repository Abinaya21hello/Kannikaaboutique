import mongoose from "mongoose";

const productslugSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // 👇 connect with category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    subCategory: {
      type: String,
      enum: [
        "Chains",
        "Chudi",
        "Salwar",
        "Saree",
        "Kurta",
        "Lehenga",
        "Mens Wear",
        "Gown",
        "Accessories"
      ],
      required: true
    },

    price: { type: Number, required: true },
    offerPrice: { type: Number },

    stock: { type: Number, default: 0 },

    sizes: [{ type: String }],

    frontImage: { type: String, required: true },
    hoverImage: { type: String, required: true },

    galleryImages: [{ type: String }],

    isTopCollection: { type: Boolean, default: false },
    isNewCollection: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("ProductSlug", productslugSchema);
