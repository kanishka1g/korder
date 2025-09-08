import Habit from "../models/Habit.js";

// Add new habit
export const addHabit = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const habit = await Habit.create({
      userId: req.user.userId,
      title,
      description,
      startDate,
      endDate,
    });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all habits for a user
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update habit
export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// daily check
export const dailyCheck = async (req, res) => {
  try {
    console.log(req.params);
    const habit = await Habit.findOne({
      _id: req.params.id,
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent duplicate check-in for today
    const alreadyCheckedIn = habit.checkIns.some((ci) => {
      const d = new Date(ci.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    habit.checkIns.push({ date: today });
    await habit.save();

    res.json({ message: "Check-in recorded", habit });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
