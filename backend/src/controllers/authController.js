import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret_key";

export const register = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role: role,
    });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, userId: user._id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
