import path, { dirname } from "path";
import express from "express";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { mongoDbName } from "../config/db_check.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  const scriptPath = path.join(process.cwd(), "test.sh");

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

export default router;
