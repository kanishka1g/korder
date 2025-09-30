import Habit from "../models/Habit.js";
import dayjs from "../plugins/dayjs.js";
import { parseDate } from "../utils/time.js";
import clock from "../utils/now.js";

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

    const dayStart = parseDate(date).startOf("day").toDate();
    const dayEnd = parseDate(date).endOf("day").toDate();
    const dayWeekday = parseDate(date).format("dddd").toLowerCase();

    const habits = await Habit.find({
      userId: req.user.userId,
      startDate: { $lte: dayEnd },
      endDate: { $gte: dayStart },
      weekdays: dayWeekday,
    }).sort({
      title: 1,
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
  try {
    const { habitId, checked, missedNote } = req.body;
    const userId = req.user.userId;
    const date = req.body.date;

    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    let dateEntry = habit.checkIns.find((c) =>
      parseDate(c.date).isSame(date, "day")
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

export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const habits = await Habit.find({ userId });
    const stats = [];
    const upcomingHabits = habits.filter((habit) =>
      dayjs(habit.startDate).isAfter(clock.now, "day")
    );
    const completedHabits = habits.filter((habit) =>
      dayjs(habit.endDate).isBefore(clock.now, "day")
    ).length;

    if (habits.length) {
      stats.push({
        title: "Total Habits",
        items: habits,
        hideView: true,
      });
    }

    if (upcomingHabits.length) {
      stats.push({
        title: "Upcoming Habits",
        items: upcomingHabits,
        hideView: false,
      });
    }

    if (completedHabits.length) {
      stats.push({
        title: "Completed Habits",
        items: completedHabits,
        hideView: false,
      });
    }

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const badDataTypes = {
  outOfScheduleCheck: "Out of Schedule Check",
};

export const findBadHabitData = async (req, res) => {
  try {
    const badEntries = [];
    const habits = await Habit.find({ userId: req.user.userId }).sort({
      title: 1,
    });

    habits.forEach((habit) => {
      habit.checkIns.forEach((check) => {
        const dayName = dayjs(check.date).format("dddd").toLowerCase();
        if (!habit.weekdays.includes(dayName)) {
          badEntries.push({
            habitTitle: habit.title,
            date: check.date,
            dayName,
            checked: check.checked,
            missedNote: check.missedNote,
            checkedId: check._id,
            type: badDataTypes.outOfScheduleCheck,
          });
        }
      });
    });

    res.json(badEntries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeBadData = async (req, res) => {
  try {
    const { checkInId } = req.params;

    const result = await Habit.updateOne(
      { "checkIns._id": checkInId },
      { $pull: { checkIns: { _id: checkInId } } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Check-in not found or already removed" });
    }

    res.json({ message: "Bad check-in deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
