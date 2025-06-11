import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import sportRoutes from "./routes/sports";
import sportPlaceRoutes from "./routes/sport-places";
import eventRoutes from "./routes/events";
import reviewRoutes from "./routes/reviews";
import forumPostRoutes from "./routes/forum-posts";
import forumReplyRoutes from "./routes/forum-replies";
import favoriteRoutes from "./routes/favorites";
import notificationRoutes from "./routes/notifications";
import mediaRoutes from "./routes/media";
import itineraryRoutes from "./routes/itineraries";
import usageStatisticsRoutes from "./routes/usage-statistics";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/sport-places", sportPlaceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/forum-posts", forumPostRoutes);
app.use("/api/forum-replies", forumReplyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/usage-statistics", usageStatisticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
