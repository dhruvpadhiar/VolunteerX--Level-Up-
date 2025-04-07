import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import ngoRoute from "./routes/ngo.route.js";
import volunteerRoute from "./routes/volunteer.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";
import eventRoute from "./routes/event.route.js";


// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.URL, // e.g., "http://localhost:5173"
  credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/ngo", ngoRoute);
app.use("/api/v1/volunteer", volunteerRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/event", eventRoute);

// Frontend static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start server only after confirming database connection
const startServer = async () => {
  try {
    await connectDB(); // Wait for database connection
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
