import mongoose from "mongoose";
import dotenv from "dotenv";
import Habit from "../models/Habit.js";
import HabitNew from "../models/habits/Habit.js";
import HabitCycle from "../models/habits/HabitCycle.js";
import HabitCheckin from "../models/habits/HabitCheckin.js";

const uri = "";

async function migrateHabits() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const oldHabits = await Habit.find();
    console.log(`📦 Found ${oldHabits.length} old habits to migrate...\n`);

    let migratedCount = 0;

    for (const oldHabit of oldHabits) {
      // 1️⃣ Create HabitNew document
      const newHabit = await HabitNew.create({
        userId: oldHabit.userId,
        title: oldHabit.title,
      });

      // 2️⃣ Create HabitCycle
      const newCycle = await HabitCycle.create({
        habitId: newHabit._id,
        startDate: oldHabit.startDate,
        endDate: oldHabit.endDate,
        weekdays: oldHabit.weekdays,
      });

      // 3️⃣ Move over checkIns
      if (oldHabit.checkIns?.length) {
        const checkins = oldHabit.checkIns.map((c) => ({
          habitCycleId: newCycle._id,
          date: c.date,
          checked: c.checked,
          missedNote: c.missedNote,
        }));
        await HabitCheckin.insertMany(checkins);
      }

      console.log(`✅ Migrated habit: "${oldHabit.title}"`);
      migratedCount++;
    }

    console.log(`\n🎉 Migration complete! Migrated ${migratedCount} habits.`);
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

migrateHabits();
