import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";
import registrationRoutes from "./routes/registration.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);

export default app;
