import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js"
import {
    createTask,
    getMyTasks,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js"
import rateLimit from "../middleware/rateLimiter.middleware.js"
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema , updateTaskSchema } from "../validations/task.validation.js";
const router = Router();

const taskLimiter = rateLimit({
  windowSeconds: 60,
  maxRequests: 30,
  keyPrefix: "tasks",
});
// protected routes
router.post("/", authMiddleware , taskLimiter ,validate(createTaskSchema), createTask);
router.get("/", authMiddleware, taskLimiter, getMyTasks);
router.put("/:id", authMiddleware, taskLimiter, validate(updateTaskSchema), updateTask);
router.delete("/:id", authMiddleware, taskLimiter, deleteTask);

export default router;
