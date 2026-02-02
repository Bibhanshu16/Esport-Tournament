import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  registerForTournament,
  myRegistrations,
  checkRegistration,
  getMyRegistrationForTournament
} from "../controllers/registration.controller.js";

const router = Router();

// user
router.post("/register", auth, registerForTournament);
router.get("/me", auth, myRegistrations);
router.get("/check/:tournamentId", auth, checkRegistration)

router.get("/my/:tournamentId", auth, getMyRegistrationForTournament)

export default router;
