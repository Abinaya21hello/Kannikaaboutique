import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Admin from "../models/adminModel.js"




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




/* ================= REGISTER ================= */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" })
    }

    const exists = await Admin.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    const admin = await Admin.create({
      name,
      email,
      password: hashed,
    })

    generateToken(res, admin._id)

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= LOGIN ================= */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    generateToken(res, admin._id)

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= LOGOUT ================= */
export const logoutAdmin = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) })
  res.json({ message: "Logged out" })
}

/* ================= CURRENT ADMIN ================= */
export const getCurrentAdmin = async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: "Not authorized" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const admin = await Admin.findById(decoded.id).select("-password")
    if (!admin) return res.status(401).json({ message: "Admin not found" })

    res.json(admin)
  } catch (error) {
    res.status(401).json({ message: "Token invalid" })
  }
}
