import mongoose from "mongoose"

const collectionSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  image: {
    type: String,
    required: true
  }

},
{ timestamps:true }
)

export default mongoose.model("Collection", collectionSchema)
