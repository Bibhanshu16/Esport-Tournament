import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import sendEmail from "../utils/email.js";
import { randomUUID } from "crypto";

const getBaseUrl = (value) => {
  if (!value) return "";
  return value.replace(/\/+$/, "");
};

const SERVER_URL = getBaseUrl(process.env.SERVER_URL);
const CLIENT_URL = getBaseUrl(process.env.CLIENT_URL);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
const isStrongEnoughPassword = (password) => (password || "").length >= 8;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isStrongEnoughPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // 1. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 2. Create user (Default role is usually 'USER' in Prisma schema)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    // 3. Create verification token
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });
    const token = randomUUID();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    });

    // 4. Send email
    try {
      if (!SERVER_URL) {
        throw new Error("SERVER_URL is not configured");
      }
      await sendEmail({
        to: email,
        subject: "Verify Email",
        html: `
          <h3>Welcome to Esports Platform</h3>
          <p>Click the link below to verify your email:</p>
          <a href="${SERVER_URL}/api/auth/verify-email?token=${token}">Verify Email</a>
        `,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
      // Log link for development if email service fails
      if (process.env.NODE_ENV !== "production") {
        console.log(`VERIFY LINK: ${SERVER_URL}/api/auth/verify-email?token=${token}`);
      }
    }

    res.status(201).json({ message: "Registered successfully. Please verify your email." });
  } catch (err) {
    console.error("Register Error:", err);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Registration failed" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token: req.query.token },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    await prisma.emailVerificationToken.delete({ where: { id: record.id } });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server misconfigured" });
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // CRITICAL: Send user data back so frontend Navbar/Hero update instantly
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    if (!req.body.email || !isValidEmail(req.body.email)) {
      return res.json({ message: "If account exists, email sent" });
    }
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    
    // Security best practice: don't reveal if email exists
    if (!user) return res.json({ message: "If account exists, email sent" });

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });
    const token = randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: `<p>Click below to reset:</p> <a href="${CLIENT_URL || SERVER_URL}/reset-password?token=${token}">Reset Password</a>`,
    });

    res.json({ message: "If account exists, email sent" });
  } catch (err) {
    res.status(500).json({ message: "Request failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }
    if (!isStrongEnoughPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    await prisma.passwordResetToken.delete({ where: { id: record.id } });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset failed" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });
    const token = randomUUID();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    try {
      if (!SERVER_URL) {
        throw new Error("SERVER_URL is not configured");
      }
      await sendEmail({
        to: user.email,
        subject: "Verify Email",
        html: `
          <h3>Verify your email</h3>
          <p>Click the link below to verify your email:</p>
          <a href="${SERVER_URL}/api/auth/verify-email?token=${token}">Verify Email</a>
        `
      });
    } catch (emailErr) {
      console.error("Resend verification failed:", emailErr.message);
      if (process.env.NODE_ENV !== "production") {
        console.log(`VERIFY LINK: ${SERVER_URL}/api/auth/verify-email?token=${token}`);
      }
    }

    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend verification email" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        phone: true
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name && !phone) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        phone: true
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
