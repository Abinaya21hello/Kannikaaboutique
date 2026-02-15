import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

export const register = async (req, res) => {
  const { name, email, password, phone, address } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) return res.status(400).json({ message: "User exists" })

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address
  })

  generateToken(res, user._id)

  res.status(201).json(user)
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "Invalid email" })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).json({ message: "Wrong password" })

  generateToken(res, user._id)

  res.json(user)
}

export const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 })
  res.json({ message: "Logged out" })
}
