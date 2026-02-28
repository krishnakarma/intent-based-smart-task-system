import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import protectedRouter from "./routes/protected.route.js";
import taskRouter from "./routes/task.route.js";
import analyticsRoutes from "./routes/analytics.route.js"
import { errorHandler } from "./middleware/error.middleware.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", healthRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);
app.use("/analytics", analyticsRoutes);
app.use("/tasks", taskRouter);
app.use((req, res)=>{
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})
app.use(errorHandler);


// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
