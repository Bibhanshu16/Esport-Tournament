import { Router } from "express";
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  activeTournament
} from "../controllers/tournament.controller.js";
import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";

const router = Router();

// public
router.get("/active", activeTournament);
router.get("/", getAllTournaments);
router.get("/:id", getTournamentById);



export default router;
