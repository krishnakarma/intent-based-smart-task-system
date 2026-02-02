import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/" , healthRouter)
// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
