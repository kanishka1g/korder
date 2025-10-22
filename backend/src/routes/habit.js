import express from "express";
import {
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  checkHabitForDay,
  getDayList,
  getStats,
  getCheckIns,
} from "../controllers/habitController.js";

const router = express.Router();

router.post("/", addHabit);
router.get("/", getHabits);
router.get("/day-list", getDayList);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/check", checkHabitForDay);
router.get("/stats", getStats);
router.get("/cycles/:id/checkins", getCheckIns);
export default router;
