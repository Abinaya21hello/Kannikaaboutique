import mongoose from "mongoose"

const subscriberSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
)

export default mongoose.model("Subscriber", subscriberSchema)
