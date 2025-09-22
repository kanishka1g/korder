import User from "../models/User.js";

export const getUserInfo = async (req, res) => {
  try {
    //TODO: get correct user info instead of get first row
    const user = await User.findOne().select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};