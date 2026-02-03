import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js"
import { createTask, getMyTasks } from "../controllers/task.controller.js";

const router = Router();

// protected routes
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getMyTasks);

export default router;
