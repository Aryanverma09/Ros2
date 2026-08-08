import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/cookieConfig.js";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
};