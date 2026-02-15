import mongoose from "mongoose"

const carouselSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    offerEnds: { type: Date }
  },
  { timestamps: true }
)

export default mongoose.model("Carousel", carouselSchema)
