import Habit from "../models/Habit.js";
import dayjs from "../plugins/dayjs.js";

export const addHabit = async (req, res) => {
  try {
    const { title, startDate, endDate, weekdays } = req.body;
    const habit = await Habit.create({
      userId: req.user.userId,
      title,
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

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId }).sort({
      title: 1,
    });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDayList = async (req, res) => {
  try {
    const { date } = req.query;

    const dayStart = dayjs(date).startOf("day").toDate();
    const dayEnd = dayjs(date).endOf("day").toDate();
    const dayWeekday = dayjs(date).format("dddd").toLowerCase();
    debugger;
    const habits = await Habit.find({
      userId: req.user.userId,
      startDate: { $lte: dayEnd },
      endDate: { $gte: dayStart },
      weekdays: dayWeekday,
    });

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

export const checkHabitForDay = async (req, res) => {
  debugger;
  try {
    const { habitId, checked, missedNote } = req.body;
    const userId = req.user.userId;
    const date = req.body.date;

    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    let dateEntry = habit.checkIns.find((c) =>
      dayjs(c.date).isSame(date, "day")
    );

    if (dateEntry) {
      dateEntry.checked = checked;
      if (!checked) {
        if (missedNote) {
          dateEntry.missedNote = missedNote;
        } else {
          dateEntry.missedNote = null;
        }
      }
    } else {
      habit.checkIns.push({
        date: date,
        checked,
        missedNote: checked ? null : missedNote || null,
      });
    }

    await habit.save();
    res.json({ message: "Habit check-in updated", habit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
