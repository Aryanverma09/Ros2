import express from "express";

import {
  handleLogin,
  handleMe,
  handleLogout,
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", handleLogin);
authRouter.get("/me", requireAuth, handleMe);
authRouter.post("/logout", handleLogout);

export default authRouter;