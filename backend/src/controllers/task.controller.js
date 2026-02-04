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

// UPDATE TASK
// UPDATE TASK
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, intent, priority, isCompleted } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (intent !== undefined) task.intent = intent;
    if (priority !== undefined) task.priority = priority;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;

    await task.save();

    res.status(200).json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE TASK
// DELETE TASK
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task deleted",
    });
  } catch (error) {
    next(error);
  }
};

