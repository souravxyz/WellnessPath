import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./app/config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./app/routes/authRoutes.js";
import sessionRoutes from "./app/routes/sessionRoutes.js";

dotenv.config();
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
// Optional: handle URL-encoded forms
app.use(express.urlencoded({ extended: true }));

// Serve static profile pictures
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", sessionRoutes);



app.get("/", (req, res) => {
  res.send("Wellness API");
});

// Optional: 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Something went wrong",
    status: "error",
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 4545;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
