import redisClient from "../config/redis.js";

const rateLimit = ({
  windowSeconds = 60,
  maxRequests = 10,
  keyPrefix = "rl",
} = {}) => {
  return async (req, res, next) => {
    try {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      const key = `${keyPrefix}:${ip}`;

      const current = await redisClient.incr(key);

      if (current === 1) {
        // first request → set expiry
        await redisClient.expire(key, windowSeconds);
      }

      if (current > maxRequests) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (error) {
      // fail-open (don’t block user if Redis fails)
      next();
    }
  };
};

export default rateLimit;
