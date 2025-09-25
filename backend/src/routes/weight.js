import express from "express";
import {
  addWeight,
  getWeights,
  updateWeight,
  deleteWeight,
} from "../controllers/weightController.js";

const router = express.Router();

router.post("/", addWeight);
router.get("/", getWeights);
router.put("/:id", updateWeight);
router.delete("/:id", deleteWeight);
export default router;
