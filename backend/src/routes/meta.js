import express from "express";
import { mongoDbName } from "../config/db_check.js";

const router = express.Router();

router.get("/db-info", (req, res) => {
  if (process.env.NODE_ENV) {
    if (process.env.NODE_ENV === "production") {
      if (mongoDbName === "korder_dev") {
        res.json("you are connected to the development database");
      }
    }
  } else if (mongoDbName === "korder_prod") {
    res.json("you are connected to the production database");
  }
  res.json();
});

export default router;
