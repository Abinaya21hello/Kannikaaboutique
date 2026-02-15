import mongoose from "mongoose"

const contactInfoSchema = new mongoose.Schema(
  {
    address: String,
    phone: String,
    email: String
  },
  { timestamps: true }
)

export default mongoose.model("ContactInfo", contactInfoSchema)
