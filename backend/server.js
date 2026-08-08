import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import mapRoutes from "./src/routes/mapRoute.js";
import navigationRoutes from "./src/routes/autoNavigate.js";
import authRouter from "./src/routes/authRoute.js";

import { requireAuth } from "./src/middleware/authMiddleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public auth routes
app.use("/api/auth", authRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend running",
  });
});

// Protected robot routes
app.use("/api", requireAuth, mapRoutes);
app.use("/api", requireAuth, navigationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});