import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { COOKIE_NAME, COOKIE_OPTIONS } from "../utils/cookieConfig.js";

const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const validUser = username.trim() === process.env.ADMIN_USERNAME;

    const validPass = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!validUser || !validPass) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        username: process.env.ADMIN_USERNAME,
        role: "operator",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.json({
      message: "Login successful",
      user: {
        username: process.env.ADMIN_USERNAME,
        role: "operator",
      },
    });
  } catch (err) {
    console.log("Login Error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const handleMe = async (req, res) => {
  return res.json({
    user: req.user,
  });
};

const handleLogout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);

  return res.json({
    message: "Logged out successfully",
  });
};

export { handleLogin, handleMe, handleLogout };