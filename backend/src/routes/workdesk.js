import { fetchDayPlan } from "../controllers/workdeskController.js";

import express from "express";

const router = express.Router();

router.get("/day-plan", fetchDayPlan);

export default router;
