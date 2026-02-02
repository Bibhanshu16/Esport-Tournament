import { Router } from "express";
import auth from "../middlewares/auth.middleware.js"
import admin from "../middlewares/admin.middleware.js"

import { approve, create, pendingRegistrations, reject } from "../controllers/admin.controller.js"

const router = Router();

router.get("/admin-dashboard", auth, admin, (req, res) => {
  res.json({ message: "Admin routes working" });
});

router.post("/create-tournaments", auth, admin, create)
router.get("/pending-registrations", auth, admin, pendingRegistrations)
router.post("/approve", auth, admin, approve)
router.post("/reject", auth, admin, reject)

export default router;
