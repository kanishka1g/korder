import Habit from "../models/habits/Habit.js";
import HabitCycle from "../models/habits/HabitCycle.js";
import HabitCheckin from "../models/habits/HabitCheckin.js";
import clock, { Clock as ClockUtil } from "../utils/clock.js";

/**
 * Create a Habit (definition) + initial HabitCycle
 * Request body: { title, startDate, endDate, weekdays }
 */
export const addHabit = async (req, res) => {
  try {
    const { title, startDate, endDate, weekdays } = req.body;
    const userId = req.user.userId;

    // 1) create Habit (definition)
    const habit = await Habit.create({
      userId,
      title,
    });

    // 2) create initial HabitCycle
    const cycle = await HabitCycle.create({
      habitId: habit._id,
      startDate,
      endDate,
      weekdays: weekdays || [],
    });

    // return combined object similar to previous behaviour
    const response = {
      ...habit.toObject(),
      cycles: [cycle],
    };

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all habits for user (with their cycles)
 */
export const getHabits = async (req, res) => {
  try {
    const userId = req.user.userId;

    const today = ClockUtil.startOfDayUTC(new Date());
    const weekday = ClockUtil.weekdayNameUTC(today);

    // 1️⃣ Get all habits for user
    const habits = await Habit.find({ userId }).select("_id title").lean();
    const habitIds = habits.map((h) => h._id);

    // 2️⃣ Get all active cycles for today
    const activeCycles = await HabitCycle.find({
      habitId: { $in: habitIds },
      startDate: { $lte: today },
      endDate: { $gte: today },
      weekdays: weekday,
    })
      .populate("habitId", "title")
      .lean();

    if (!activeCycles.length) return res.json([]);

    // 3️⃣ Get today's check-ins for these cycles
    const cycleIds = activeCycles.map((c) => c._id);
    const checkins = await HabitCheckin.find({
      habitCycleId: { $in: cycleIds },
      date: { $gte: today, $lte: ClockUtil.endOfDayUTC(today) },
    }).lean();

    // 4️⃣ Merge habit + cycle + check-in data
    const result = activeCycles.map((cycle) => {
      const checkin = checkins.find(
        (c) => String(c.habitCycleId) === String(cycle._id)
      );

      return {
        _id: cycle.habitId?._id,
        title: cycle.habitId?.title,
        habitCycleId: cycle._id,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        weekdays: cycle.weekdays,
        checked: checkin?.checked || false,
        missedNote: checkin?.missedNote || null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching active habits:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get list of habits active on a specific day (same semantics as previous getDayList)
 * Query param: date (ISO date)
 */
export const getDayList = async (req, res) => {
  try {
    const userId = req.user.userId;
    const date = new Date(req.query.date);

    const dayStart = ClockUtil.startOfDayUTC(date);
    const dayEnd = ClockUtil.endOfDayUTC(date);
    const dayWeekday = ClockUtil.weekdayNameUTC(date);

    // 1️⃣ Find all habits for user
    const userHabits = await Habit.find({ userId }).select("_id title").lean();
    const habitIds = userHabits.map((h) => h._id);

    // 2️⃣ Find all cycles active for this date and weekday
    const cycles = await HabitCycle.find({
      habitId: { $in: habitIds },
      startDate: { $lte: dayEnd },
      endDate: { $gte: dayStart },
      weekdays: dayWeekday,
    })
      .populate("habitId", "title") // bring in habit title
      .lean();

    if (!cycles.length) return res.json([]);

    // 3️⃣ Fetch all check-ins for these cycles on this date
    const cycleIds = cycles.map((c) => c._id);
    const checkins = await HabitCheckin.find({
      habitCycleId: { $in: cycleIds },
      date: { $gte: dayStart, $lte: dayEnd },
    }).lean();

    // 4️⃣ Merge cycle + check-in + habit info
    const result = cycles.map((cycle) => {
      const checkin = checkins.find(
        (c) => String(c.habitCycleId) === String(cycle._id)
      );

      return {
        _id: cycle.habitId?._id,
        title: cycle.habitId?.title,
        habitCycleId: cycle._id,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        weekdays: cycle.weekdays,
        checked: checkin?.checked || false,
        missedNote: checkin?.missedNote || null,
        checkinDate: checkin?.date || null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update habit:
 * - If req.body contains title -> update Habit definition
 * - If req.body contains startDate/endDate/weekdays -> update the most relevant HabitCycle
 *
 * Route param: id = habitId
 */
export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const payload = req.body;

    // ensure habit belongs to user
    const habit = await Habit.findOne({ _id: id, userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // update habit fields if provided
    const habitFields = {};
    if (payload.title !== undefined) habitFields.title = payload.title;

    if (Object.keys(habitFields).length) {
      await Habit.updateOne({ _id: id }, { $set: habitFields });
    }

    // if cycle fields are provided, update the most relevant cycle:
    // pick active cycle (where today is inside start/end), else the latest cycle by startDate
    if (payload.startDate || payload.endDate || payload.weekdays) {
      const today = clock.now;
      let cycle = await HabitCycle.findOne({
        habitId: id,
        startDate: { $lte: today },
        endDate: { $gte: today },
      });

      if (!cycle) {
        // fallback: latest cycle
        cycle = await HabitCycle.findOne({ habitId: id }).sort({
          startDate: -1,
        });
      }

      if (!cycle) {
        // no cycle exists — create a new one from provided data
        const newCycle = await HabitCycle.create({
          habitId: id,
          startDate: payload.startDate || today,
          endDate: payload.endDate || today,
          weekdays: payload.weekdays || [],
        });
        return res.json({
          habit: await Habit.findById(id).lean(),
          cycles: [newCycle],
        });
      } else {
        const update = {};
        if (payload.startDate) update.startDate = payload.startDate;
        if (payload.endDate) update.endDate = payload.endDate;
        if (payload.weekdays) update.weekdays = payload.weekdays;

        const updatedCycle = await HabitCycle.findByIdAndUpdate(
          cycle._id,
          update,
          { new: true }
        ).lean();
        const updatedHabit = await Habit.findById(id).lean();
        return res.json({ habit: updatedHabit, updatedCycle });
      }
    }

    // default: return updated habit
    const updatedHabit = await Habit.findById(id).lean();
    res.json(updatedHabit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete habit and all related cycles + checkins
 * Route param: id = habitId
 */
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const habit = await Habit.findOneAndDelete({ _id: id, userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // delete cycles and checkins
    const cycles = await HabitCycle.find({ habitId: id }).select("_id").lean();
    const cycleIds = cycles.map((c) => c._id);

    await HabitCycle.deleteMany({ habitId: id });
    if (cycleIds.length) {
      await HabitCheckin.deleteMany({ habitCycleId: { $in: cycleIds } });
    }

    res.json({ message: `Habit ${habit.title.toLowerCase()} deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Check-in for a habit on a given day
 * Body: { habitId, checked, missedNote, date }
 */
export const checkHabitForDay = async (req, res) => {
  try {
    const { habitId, checked, missedNote, date } = req.body;
    const userId = req.user.userId;

    // ensure habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const targetDate = ClockUtil.startOfDayUTC(new Date(date));
    const weekday = ClockUtil.weekdayNameUTC(targetDate);

    // find an active cycle that contains this date
    let cycle = await HabitCycle.findOne({
      habitId,
      startDate: { $lte: targetDate },
      endDate: { $gte: targetDate },
    });

    if (!cycle) {
      // not found — create a new cycle that covers only that date (keeps data consistent)
      cycle = await HabitCycle.create({
        habitId,
        startDate: targetDate,
        endDate: targetDate,
        weekdays: [weekday],
      });
    }

    // find existing checkin for that cycle + date
    const existing = await HabitCheckin.findOne({
      habitCycleId: cycle._id,
      date: targetDate,
    });

    if (existing) {
      existing.checked = !!checked;
      existing.missedNote = checked ? null : missedNote || null;
      await existing.save();
    } else {
      await HabitCheckin.create({
        habitCycleId: cycle._id,
        date: targetDate,
        checked: !!checked,
        missedNote: checked ? null : missedNote || null,
      });
    }

    res.json({ message: "Habit check-in updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get stats (Total, Upcoming, Completed, Missed)
 * Behaviour mirrors previous logic but adapted to new schema
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1) fetch all habits for user
    const habits = await Habit.find({ userId }).lean();

    // 2) fetch cycles and checkins in bulk
    const habitIds = habits.map((h) => h._id);
    const cycles = await HabitCycle.find({ habitId: { $in: habitIds } }).lean();
    const cycleIds = cycles.map((c) => c._id);
    const checkins = await HabitCheckin.find({
      habitCycleId: { $in: cycleIds },
    }).lean();

    const stats = [];
    const upcomingHabits = [];
    const completedHabits = [];
    const missedHabits = [];

    for (const habit of habits) {
      // get cycles for this habit
      const myCycles = cycles.filter(
        (c) => String(c.habitId) === String(habit._id)
      );

      // if no cycles, skip for now
      if (!myCycles.length) continue;

      // Determine if habit is upcoming or completed using earliest start / latest end
      const earliestStart = new Date(
        Math.min(...myCycles.map((c) => new Date(c.startDate).getTime()))
      );
      const latestEnd = new Date(
        Math.max(...myCycles.map((c) => new Date(c.endDate).getTime()))
      );

      if (ClockUtil.isAfterDayUTC(earliestStart, clock.now))
        upcomingHabits.push(habit);
      if (ClockUtil.isBeforeDayUTC(latestEnd, clock.now))
        completedHabits.push(habit);

      // For missed dates we need to iterate each cycle's date range
      for (const cycle of myCycles) {
        // skip cycles that haven't started yet
        if (ClockUtil.isAfterDayUTC(cycle.startDate, clock.now)) continue;

        // compute end day: if cycle ended before today use cycle.endDate else yesterday
        const end = ClockUtil.isBeforeDayUTC(cycle.endDate, clock.now)
          ? ClockUtil.startOfDayUTC(cycle.endDate)
          : clock.now.setUTCDate(clock.now.getUTCDate() - 1);

        let currentDate = ClockUtil.startOfDayUTC(cycle.startDate);
        const missedDates = [];

        while (ClockUtil.isBeforeOrSameDayUTC(currentDate, end)) {
          const weekday = currentDate
            .toLocaleDateString("en-US", {
              weekday: "long",
            })
            .toLowerCase();

          if (cycle.weekdays.includes(weekday)) {
            const match = checkins.find(
              (ci) =>
                String(ci.habitCycleId) === String(cycle._id) &&
                ClockUtil.isSameDayUTC(ci.date, currentDate)
            );

            if (!match || (!match.checked && !match.missedNote)) {
              missedDates.push(currentDate.toISOString());
            }
          }

          currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        if (missedDates.length > 0) {
          missedHabits.push({ title: habit.title, missedDates });
        }
      }
    }

    // build stats response
    if (habits.length) {
      stats.push({
        title: "Total Habits",
        items: habits,
        hideView: true,
        type: "HABIT",
      });
    }
    if (upcomingHabits.length) {
      stats.push({
        title: "Upcoming Habits",
        items: upcomingHabits,
        hideView: false,
        type: "HABIT",
      });
    }
    if (completedHabits.length) {
      stats.push({
        title: "Completed Habits",
        items: completedHabits,
        hideView: false,
        type: "HABIT",
      });
    }
    if (missedHabits.length) {
      stats.push({
        title: "Missed Habits",
        items: missedHabits,
        hideView: false,
        type: "CHECKINS",
      });
    }

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
