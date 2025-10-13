import Habit from "../models/Habit.js";
import clock, { Clock as ClockUtil } from "../utils/clock.js";

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
    const date = new Date(req.query.date);

    const dayStart = ClockUtil.startOfDayUTC(date);
    const dayEnd = ClockUtil.endOfDayUTC(date);

    const dayWeekday = ClockUtil.weekdayNameUTC(date);

    const habits = await Habit.find({
      userId: req.user.userId,
      startDate: { $lte: dayEnd },
      endDate: { $gte: dayStart },
      weekdays: dayWeekday,
    }).sort({ title: 1 });

    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
    const { habitId, checked, missedNote, date } = req.body;
    const userId = req.user.userId;

    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const targetDate = ClockUtil.startOfDayUTC(new Date(date));

    const dateEntry = habit.checkIns.find((c) =>
      ClockUtil.isSameDayUTC(c.date, targetDate)
    );

    if (dateEntry) {
      dateEntry.checked = checked;
      dateEntry.missedNote = checked ? null : missedNote || null;
    } else {
      habit.checkIns.push({
        date: targetDate,
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

    const today = ClockUtil.startOfDayUTC(clock.now);

    const upcomingHabits = habits.filter((habit) =>
      ClockUtil.isAfterDayUTC(habit.startDate, today)
    );

    const completedHabits = habits.filter((habit) =>
      ClockUtil.isBeforeDayUTC(habit.endDate, today)
    );

    // 🕓 Find missed dates for each habit
    const missedHabits = [];

    for (const habit of habits) {
      const { title, startDate, endDate, weekdays, checkIns } = habit;

      // Skip habits that haven’t started yet
      if (ClockUtil.isAfterDayUTC(startDate, today)) continue;

      const end = ClockUtil.isBeforeDayUTC(endDate, today)
        ? ClockUtil.startOfDayUTC(endDate)
        : today;

      const missedDates = [];
      let currentDate = ClockUtil.startOfDayUTC(startDate);

      while (ClockUtil.isBeforeOrSameDayUTC(currentDate, end)) {
        const weekday = currentDate
          .toLocaleDateString("en-US", {
            weekday: "long",
          })
          .toLowerCase();

        if (weekdays.includes(weekday)) {
          const match = checkIns.find((c) =>
            ClockUtil.isSameDayUTC(new Date(c.date), currentDate)
          );

          if (!match || !match.checked) {
            // Save missed date in ISO format (YYYY-MM-DD)
            missedDates.push(currentDate.toISOString().split("T")[0]);
          }
        }

        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }

      if (missedDates.length > 0) {
        missedHabits.push({ title, missedDates });
      }
    }

    // 🧮 Build stats list
    if (habits.length)
      stats.push({
        title: "Total Habits",
        items: habits,
        hideView: true,
        type: "HABIT",
      });
    if (upcomingHabits.length)
      stats.push({
        title: "Upcoming Habits",
        items: upcomingHabits,
        hideView: false,
        type: "HABIT",
      });
    if (completedHabits.length)
      stats.push({
        title: "Completed Habits",
        items: completedHabits,
        hideView: false,
        type: "HABIT",
      });
    if (missedHabits.length)
      stats.push({
        title: "Missed Habits",
        items: missedHabits,
        hideView: false,
        type: "CHECKINS",
      });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
