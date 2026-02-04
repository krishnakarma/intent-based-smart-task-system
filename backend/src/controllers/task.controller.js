import Task from "../models/task.model.js";
import remainderQueue from "../queues/remainder.queue.js";

// CREATE TASK
export const createTask = async (req, res, next) => {
  try {
    // 1️⃣ Extract all required fields (deadline was missing before)
    const { title, description, intent, priority, deadline } = req.body;

    // 2️⃣ Basic validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // 3️⃣ Create task in DB (source of truth)
    const task = await Task.create({
      title,
      description,
      intent,
      priority,
      deadline,
      user: req.user._id, // injected by auth middleware
    });

    // 4️⃣ Schedule reminder ASYNC (non-blocking)
    if (deadline) {
      const delay = new Date(deadline).getTime() - Date.now();

      if (delay > 0) {
        await remainderQueue.add(
          "task-remainder",
          {
            userId: req.user._id,
            taskId: task._id,
            title: task.title,
          },
          { delay }
        );
      }
    }

    // 5️⃣ Respond AFTER everything important is done
    return res.status(201).json({
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
