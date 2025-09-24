import express from "express";
import { mongoDbName } from "../config/db_check.js";

const router = express.Router();

router.get("/db-info", (req, res) => {
  res.json({
    dbName: mongoDbName,
    env: process.env.NODE_ENV || "development",
  });
});

export default router;
