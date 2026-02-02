import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  registerForTournament,
  myRegistrations
} from "../controllers/registration.controller.js";

const router = Router();

// user
router.post("/", auth, registerForTournament);
router.get("/me", auth, myRegistrations);

export default router;
