import { Router } from "express";
import auth from "../middlewares/auth.middleware.js"
import admin from "../middlewares/admin.middleware.js"

import { create } from "../controllers/admin.controller.js"

const router = Router();

router.get("/admin-dashboard", auth, admin, (req, res) => {
  res.json({ message: "Admin routes working" });
});

router.post("/create-tournaments", auth, admin, create)

export default router;
