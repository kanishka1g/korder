import { fetchSchedules } from "../controllers/workdeskController.js";

import express from "express";

const router = express.Router();

router.get("/schedules", fetchSchedules);

export default router;
