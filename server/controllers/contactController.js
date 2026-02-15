import Subscriber from "../models/Subscriber.js"
import ContactInfo from "../models/ContactInfo.js"

//
// 📌 SUBSCRIBE WHATSAPP
//
export const addSubscriber = async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" })
    }

    const exists = await Subscriber.findOne({ phone })

    if (exists) {
      return res.status(400).json({ message: "Already subscribed" })
    }

    const subscriber = await Subscriber.create({ phone })

    res.status(201).json({
      message: "Subscribed successfully",
      subscriber
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
// 📌 GET ALL SUBSCRIBERS (Admin)
//
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 })
    res.json(subscribers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
// 📌 GET CONTACT INFO
//
export const getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findOne()
    res.json(info)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
// 📌 UPDATE CONTACT INFO (Admin)
//
export const updateContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne()

    if (!info) {
      info = await ContactInfo.create(req.body)
    } else {
      info = await ContactInfo.findByIdAndUpdate(
        info._id,
        req.body,
        { new: true }
      )
    }

    res.json(info)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
