import express from "express";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  resetPassword,
  register,
  verifyEmail,
  updateProfile,
  getMe, // ✅ added
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify/:token", verifyEmail);

router.post("/change-password", protect, changePassword);
router.get("/logout", logout);

//Get logged-in user
router.get("/me", protect, getMe);

//Update profile
router.put(
  "/update-profile",
  protect,
  upload.single("profilePic"),
  updateProfile
);

export default router;
