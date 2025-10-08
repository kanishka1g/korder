// migrateHabits.js
import mongoose from "mongoose";
import { Habit } from "../src/models/Habit.js";

const uri = "mongodb://localhost:27017/korder"; // change if needed

// 1. Old schema (your current one)
// const OldHabitSchema = new mongoose.Schema({
//   name: String,
//   startDate: Date,
//   endDate: Date,
//   weekdays: [String],
//   checkins: [
//     {
//       date: Date,
//       status: String,
//     },
//   ],
// });

const OldHabit = mongoose.model("OldHabit", Habit, "habits");

// 2. New schemas
const HabitSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const HabitCycleSchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
  startDate: Date,
  endDate: Date,
  weekdays: [String],
  createdAt: { type: Date, default: Date.now },
});

const HabitCheckinSchema = new mongoose.Schema({
  habitCycleId: { type: mongoose.Schema.Types.ObjectId, ref: "HabitCycle" },
  date: Date,
  status: { type: String, default: "done" },
  createdAt: { type: Date, default: Date.now },
});

const Habit = mongoose.model("Habit", HabitSchema, "habits_new");
const HabitCycle = mongoose.model(
  "HabitCycle",
  HabitCycleSchema,
  "habitCycles"
);
const HabitCheckin = mongoose.model(
  "HabitCheckin",
  HabitCheckinSchema,
  "habitCheckins"
);

async function migrate() {
  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  const oldHabits = await OldHabit.find();
  let count = 0;

  for (const habit of oldHabits) {
    // Create base habit
    const newHabit = await Habit.create({
      name: habit.name,
      description: "",
    });

    // Create habit cycle
    const newCycle = await HabitCycle.create({
      habitId: newHabit._id,
      startDate: habit.startDate,
      endDate: habit.endDate,
      weekdays: habit.weekdays || [],
    });

    // Create check-ins
    if (habit.checkins?.length) {
      const checkinDocs = habit.checkins.map((c) => ({
        habitCycleId: newCycle._id,
        date: c.date,
        status: c.status || "done",
      }));
      await HabitCheckin.insertMany(checkinDocs);
    }

    count++;
    console.log(`✅ Migrated habit: ${habit.name}`);
  }

  console.log(`🎉 Migration complete! Migrated ${count} habits.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  mongoose.disconnect();
});
