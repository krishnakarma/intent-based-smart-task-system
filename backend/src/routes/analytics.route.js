import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getAnalyticsSummary } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/summary", authMiddleware, getAnalyticsSummary);

export default router;
