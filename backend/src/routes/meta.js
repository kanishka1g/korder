import { dirname } from "path";
import express from "express";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { mongoDbName } from "../config/db_check.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);

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
  const scriptPath = "/app/deploy.sh";

  exec(`bash "${scriptPath}"`, (error, stdout, stderr) => {
    console.log("Running script at:", scriptPath);
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);

    if (error) {
      return res
        .status(500)
        .json({ success: false, error: stderr || error.message });
    }
    res.json({ success: true, output: stdout || "Script ran successfully" });
  });
});

router.get("/day-plan", async (req, res) => {
  const response = await fetch("https://n8n.korder.cloud/webhook/day-paln");
  const data = await response.json();
  res.json(data);
});

export default router;
