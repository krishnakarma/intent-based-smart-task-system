import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import protectedRouter from "./routes/protected.route.js";
import taskRouter from "./routes/task.route.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", healthRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);
app.use("/tasks", taskRouter);


// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
