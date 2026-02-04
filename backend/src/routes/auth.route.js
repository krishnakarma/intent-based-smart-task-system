import { Router } from "express";
import { login , signup } from "../controllers/auth.controller.js";
import rateLimit  from "../middleware/rateLimiter.middleware.js"
const router = Router();

//RateLimiter
const authLimiter = rateLimit({
  windowSeconds: 60,
  maxRequests: 5,
  keyPrefix: "auth",
});
//signUp 
router.post("/signup" , signup);
//login
router.post("/login" , login);


export default router;