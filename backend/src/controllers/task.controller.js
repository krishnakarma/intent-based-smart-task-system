import Task from "../models/task.model.js";
import remainderQueue from "../queues/remainder.queue.js";
import redisClient from "../config/redis.js";

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


    await redisClient.incr(`user:${req.user._id}:tasks:created`);

    // 4️⃣ Schedule reminder ASYNC (non-blocking)
    if (deadline) {
      let delay = new Date(deadline).getTime() - Date.now();

      // 🔥 adaptive offset
      const habitKey = `user:${req.user._id}:avgDelayMinutes`;
      const avgDelay = await redisClient.get(habitKey);
      if (avgDelay) {
        delay -= Number(avgDelay) * 60 * 1000;
      }
      if (delay < 0) delay = 0;
      if (delay > 0) {
        await remainderQueue.add(
          "task-remainder",
          {
            userId: req.user._id,
            taskId: task._id,
            title: task.title,
          },
          { delay },
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
    const userId = req.user._id;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = { user: userId };

    if (req.query.priority) {
      filter.priority = Number(req.query.priority);
    }

    if (req.query.intent) {
      filter.intent = req.query.intent;
    }

    if (req.query.isCompleted) {
      filter.isCompleted = req.query.isCompleted === "true";
    }

    // Sorting
    let sort = { createdAt: -1 }; // default newest first

    if (req.query.sort === "createdAt_asc") {
      sort = { createdAt: 1 };
    }

    if (req.query.sort === "priority_desc") {
      sort = { priority: -1 };
    }

    // Execute query
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE TASK
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

    // 🔑 capture OLD state BEFORE update
    const wasCompleted = task.isCompleted;

    const { title, description, intent, priority, isCompleted } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (intent !== undefined) task.intent = intent;
    if (priority !== undefined) task.priority = priority;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    if(!wasCompleted && isCompleted === true){
      await redisClient.incr(`user:${req.user._id}:tasks:completed`);
      await redisClient.incr(`user:${req.user._id}:tasks:completed:today`);
    }
    await task.save();

    // 🧠 adaptive logic: false → true transition
    if (!wasCompleted && isCompleted === true && task.deadline) {
      const completedAt = Date.now();
      const plannedAt = new Date(task.deadline).getTime();

      const delayMinutes = Math.round((completedAt - plannedAt) / 60000);

      if (delayMinutes > 0) {
        const key = `user:${req.user._id}:avgDelayMinutes`;

        const prev = await redisClient.get(key);
        const prevVal = prev ? Number(prev) : 0;

        const newAvg = Math.round(prevVal * 0.7 + delayMinutes * 0.3);

        await redisClient.set(key, newAvg);
      }
    }

    return res.status(200).json({
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
