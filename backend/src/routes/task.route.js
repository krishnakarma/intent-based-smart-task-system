import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js"
import {
    createTask,
    getMyTasks,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js"
const router = Router();

// protected routes
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getMyTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
