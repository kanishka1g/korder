import {
  getDayPlan,
  refreshDayPlan,
} from "../controllers/workdeskController.js";

import express from "express";

const router = express.Router();

router.get("/day-plan", getDayPlan);
router.post("/day-plan/refresh", refreshDayPlan);

export default router;
