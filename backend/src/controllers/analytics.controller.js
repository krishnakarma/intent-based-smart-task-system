import redisClient from "../config/redis.js";

export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Redis keys
    const createdKey = `user:${userId}:tasks:created`;
    const completedKey = `user:${userId}:tasks:completed`;
    const completedTodayKey = `user:${userId}:tasks:completed:today`;
    const avgDelayKey = `user:${userId}:avgDelayMinutes`;

    // Fetch in parallel (FAST)
    const [
      created,
      completed,
      completedToday,
      avgDelay,
    ] = await Promise.all([
      redisClient.get(createdKey),
      redisClient.get(completedKey),
      redisClient.get(completedTodayKey),
      redisClient.get(avgDelayKey),
    ]);

    const createdNum = Number(created) || 0;
    const completedNum = Number(completed) || 0;

    const completionRate =
      createdNum === 0 ? 0 : completedNum / createdNum;

    return res.json({
      today: {
        completed: Number(completedToday) || 0,
      },
      overall: {
        created: createdNum,
        completed: completedNum,
        completionRate: Number(completionRate.toFixed(2)),
      },
      habits: {
        avgDelayMinutes: Number(avgDelay) || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
