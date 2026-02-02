// express app (middleWare + routes)
// src/app.js
import express from "express";

const app = express();

// middlewares
app.use(express.json());

// routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.post("/echo", (req, res) => {
  res.json({ received: req.body });
});

export default app;
