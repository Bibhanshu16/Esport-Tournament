import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
  updateMe,
  resendVerification,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import rateLimit from "../middlewares/rateLimit.middleware.js";
const router = Router();
const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many registration attempts. Try again later."
});
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try again later."
});
const forgotLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many reset requests. Try again later."
});
const resetLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many reset attempts. Try again later."
});
const resendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many verification requests. Try again later."
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotLimiter, forgotPassword);
router.post("/reset-password", resetLimiter, resetPassword);
router.get("/me", authMiddleware, me);
router.put("/me", authMiddleware, updateMe);
router.post("/resend-verification", resendLimiter, resendVerification);


export default router 
