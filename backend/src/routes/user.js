import express from "express";

import { getUserInfo } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getUserInfo);

export default router;