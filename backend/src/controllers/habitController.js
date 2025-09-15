import Habit from "../models/Habit.js";
import dayjs from "../plugins/dayjs.js";
	import clock  from "../utils/now.js";

// Add new habit
export const addHabit = async (req, res) => {
  try {
    const { title, description, startDate, endDate, weekdays } = req.body;
    debugger;
    const habit = await Habit.create({
      userId: req.user.userId,
      title,
      description,
      startDate,
      endDate,
      weekdays,
      checkIns: [],
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
    res.json({ message: `Habit ${habit.title.toLowerCase()} deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const dailyCheck = async (req, res) => {
try {
    const habit = await Habit.findOne({ _id: req.params.id });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const today = clock.now.startOf("day");
    const todayTime = today.valueOf();


    const index = habit.checkIns.findIndex((ci) => {
      const ciDate = dayjs(ci.date).startOf("day");
      return ciDate.valueOf() === todayTime;
    });

    if (index >= 0) {
      habit.checkIns.splice(index, 1);
      await habit.save();
      return res.json({ message: `Checked out of ${habit.title.toLowerCase()}` });
    }

    habit.checkIns.push({ date: today.toDate() });
    await habit.save();
    return res.json({ message: `Checked in to ${habit.title.toLowerCase()}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
