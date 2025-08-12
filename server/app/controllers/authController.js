import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fs from "fs";
import sendEmail from "../config/email.js";
import {
  getVerifyEmailTemplate,
  getWelcomeEmailTemplate,
  getPasswordResetEmail,
  getPasswordChangedNotification,
} from "../config/emailTemplates.js";
import cloudinary from "../config/cloudinary.js";
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// ✅ Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid link" });

    user.isVerified = true;
    await user.save();

    // Send welcome email after verification
    const { subject, html } = getWelcomeEmailTemplate(user.name);
    await sendEmail({ to: user.email, subject, html });

    res.redirect(`${process.env.CLIENT_URL}/dashboard?verified=true`);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Verification link invalid or expired" });
  }
};

// ✅ Register (soft verification)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      isVerified: false,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Send verification email only
    const verifyToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    const verifyURL = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
    const verifyEmailData = getVerifyEmailTemplate(user.name, verifyURL);
    await sendEmail({
      to: user.email,
      subject: verifyEmailData.subject,
      html: verifyEmailData.html,
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};


// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, isVerified: user.isVerified },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "10m" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const resetEmailData = getPasswordResetEmail(user.name, resetLink);
    await sendEmail({
      to: user.email,
      subject: resetEmailData.subject,
      html: resetEmailData.html,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send reset link", error: error.message });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    const changedEmailData = getPasswordChangedNotification(user.name);
    await sendEmail({
      to: user.email,
      subject: changedEmailData.subject,
      html: changedEmailData.html,
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

// ✅ Change Password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ message: "Password change failed" });
  }
};

// ✅ Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// user-profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

// user-profile update
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, bio } = req.body;

    // Update text fields
    if (name) user.name = name;
    if (bio) user.bio = bio;

    // Upload profile image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics",
      });
      user.profilePic = result.secure_url;

      // Remove local file after uploading
      fs.unlinkSync(req.file.path);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Update error:", err.message);
    res
      .status(500)
      .json({ message: "Profile update failed", error: err.message });
  }
};
