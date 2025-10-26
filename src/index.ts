import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ENV } from "./config/env.js";
import { testConnection } from "./config/database.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import artistRoutes from "./routes/artists.js";
import serviceRoutes from "./routes/services.js";
import appointmentRoutes from "./routes/appointments.js";
import reviewRoutes from "./routes/reviews.js";
import messageRoutes from "./routes/messages.js";
import favoriteRoutes from "./routes/favorites.js";

const app = express();

// ✅ Security & body parsing
app.use(helmet());
app.use(
  cors({
    origin: ENV.FRONTEND_URL || "*", // 🚀 fallback seguro no Railway
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/favorites", favoriteRoutes);

// ✅ Error middleware
app.use(notFound);
app.use(errorHandler);

// ✅ Start server (Railway compatible)
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("❌ Failed to connect to database. Exiting...");
      process.exit(1);
    }

   const PORT = Number(process.env.PORT) || Number(ENV.PORT) || 3000;

// ⚙️ compatível com Railway
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${ENV.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${ENV.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
