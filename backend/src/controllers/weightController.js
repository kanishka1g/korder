import Weight from "../models/Weight.js";

export const addWeight = async (req, res) => {
  try {
    const { date, weight, calories } = req.body;
    const item = await Weight.create({
      userId: req.user.userId,
      date,
      weight,
      calories,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWeights = async (req, res) => {
  try {
    const weights = await Weight.find({ userId: req.user.userId }).sort({
      date: 1,
    });
    res.json(weights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWeight = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Weight.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Weight not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteWeight = async (req, res) => {
  try {
    const { id } = req.params;
    const weight = await Weight.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });
    if (!weight) return res.status(404).json({ message: "Weight not found" });
    res.json({ message: "Weight  deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
