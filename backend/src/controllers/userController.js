import User from "../models/User.js";

export const getUserInfo = async (req, res) => {
  try {
    //TODO: get correct user info instead of get first row
    const user = await User.find({ username: "kanishka1g" });
    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
