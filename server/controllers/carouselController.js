import Carousel from "../models/Carousel.js"

// CREATE
export const createCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.create({
      title: req.body.title,
      description: req.body.description,
      offerEnds: req.body.offerEnds,
      image: req.file ? req.file.path : ""
    })

    res.status(201).json(carousel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// GET ALL
export const getCarousels = async (req, res) => {
  const carousels = await Carousel.find()
  res.json(carousels)
}

// GET ONE
export const getCarouselById = async (req, res) => {
  const carousel = await Carousel.findById(req.params.id)
  if (!carousel) return res.status(404).json({ message: "Not found" })
  res.json(carousel)
}

// UPDATE
export const updateCarousel = async (req, res) => {
  const carousel = await Carousel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(carousel)
}

// DELETE
export const deleteCarousel = async (req, res) => {
  await Carousel.findByIdAndDelete(req.params.id)
  res.json({ message: "Deleted successfully" })
}
