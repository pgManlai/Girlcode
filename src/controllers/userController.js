import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";
import createJWT from "../utils/createJWT.js";

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashed, name },
    });

    createJWT(res, newUser.id);

    res.json({
      success: true,
      message: "User registered successfully",
      user: { id: newUser.id, email, name },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    createJWT(res, user.id);

    res.json({
      success: true,
      message: "Logged in",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.json({ success: true, message: "Logged out successfully" });
};

export const currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user },
      select: { id: true, email: true, name: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
