import express from "express";
import { mongoDbName } from "../config/db_check.js";
import clock from "../utils/now";

const now = useNow();

const router = express.Router();

router.get("/db-info", (req, res) => {
  res.json({
    dbName: mongoDbName,
    env: process.env.NODE_ENV || "development",
    now: clock.now,
  });
});

export default router;
