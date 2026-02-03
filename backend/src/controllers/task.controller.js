import Task from "../models/task.model.js";

// CREATE TASK
export const createTask = async (req, res, next) => {
  try {
    const { title, description, intent, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      intent,
      priority,
      user: req.user._id, // from auth middleware
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// GET MY TASKS
export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
