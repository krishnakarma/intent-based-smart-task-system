import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  intent: z.enum(["focus", "deep-focus", "low-energy", "general"]).optional(),
  priority: z.number().min(1).max(5).optional(),
  deadline: z.string().datetime().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  intent: z.enum(["focus", "deep-focus", "low-energy", "general"]).optional(),
  priority: z.number().min(1).max(5).optional(),
  isCompleted: z.boolean().optional(),
});