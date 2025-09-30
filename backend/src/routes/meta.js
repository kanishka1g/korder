import express from "express";
import { mongoDbName } from "../config/db_check.js";

const router = express.Router();

router.get("/verify", (req, res) => {
  if (mongoDbName !== "korder_dev" && mongoDbName !== "korder_prod") {
    res.json("Unknown");
  }

  if (process.env.NODE_ENV) {
    if (process.env.NODE_ENV === "production") {
      if (mongoDbName === "korder_dev") {
        res.json("development");
      }
    }
  } else if (mongoDbName === "korder_prod") {
    res.json("production");
  }
  res.json();
});

export default router;
