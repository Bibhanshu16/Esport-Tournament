import { Router } from "express";
import auth from "../middlewares/auth.middleware.js"
import admin from "../middlewares/admin.middleware.js"

import { approve, create, pendingRegistrations, reject, registrationsByStatus, broadcastTournamentEmail } from "../controllers/admin.controller.js"

const router = Router();

router.get("/admin-dashboard", auth, admin, (req, res) => {
  res.json({ message: "Admin routes working" });
});

router.post("/create-tournaments", auth, admin, create)
router.get("/pending-registrations", auth, admin, pendingRegistrations)
router.get("/registrations", auth, admin, registrationsByStatus)
router.post("/broadcast-email", auth, admin, broadcastTournamentEmail)
router.post("/approve", auth, admin, approve)
router.post("/reject", auth, admin, reject)

export default router;
