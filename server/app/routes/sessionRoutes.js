import express from "express";
import {
  getPublicSessions,
  getMySessions,
  getSessionById,
  saveDraft,
  publishSession,
  getPublicSessionById,
  deleteSession,
} from "../controllers/sessionController.js";
import { protect, requireVerified } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/sessions", getPublicSessions);
router.get("/sessions/:id", getPublicSessionById);
// Private
router.get("/my-sessions", protect, getMySessions);
router.get("/my-sessions/:id", protect, getSessionById);
router.post("/my-sessions/save-draft", protect, saveDraft);
router.post("/my-sessions/publish", protect, requireVerified, publishSession);
router.delete("/my-sessions/:id", protect, deleteSession);
export default router;
