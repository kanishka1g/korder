import express from "express";
import { mongoDbName } from "../config/db_check.js";
import { exec } from "child_process";
import path from "path";

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

router.post("/deploy", (req, res) => {
  const scriptPath = path.join(__dirname, "..", "test.sh");

  exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      return res.status(500).json({ success: false, error: stderr });
    }
    res.json({ success: true, output: stdout });
  });
});

export default router;
