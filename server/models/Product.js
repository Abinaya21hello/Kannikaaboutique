import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    // Main category (Women, Accessories etc)
    category: {
      type: String,
      required: true
    },

    // Sub category (Chains, Saree, Kurta etc)
    subCategory: {
      type: String,
      enum: [
        "Chains",
        "Chudi",
        "Salwar",
        "Saree",
        "Kurta",
        "Lehenga",
        "Gown",
        "Accessories"
      ],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    offerPrice: {
      type: Number
    },

    stock: {
      type: Number,
      default: 0
    },

    sizes: [
      {
        type: String
      }
    ],

    // 👇 Front image (shown normally)
    frontImage: {
      type: String,
      required: true
    },

    // 👇 Hover image (when mouse hover)
    hoverImage: {
      type: String,
      required: true
    },

    // 👇 Extra gallery images
    galleryImages: [
      {
        type: String
      }
    ],

    // 👇 Top Collection
    isTopCollection: {
      type: Boolean,
      default: false
    },

    // 👇 New Collection
    isNewCollection: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model("Product", productSchema)
