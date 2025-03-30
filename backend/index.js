// backend/index.js
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { securityHeaders } from "./middleware/security.js";
import cruxRoutes from "./routes/cruxRoutes.js";
import { SERVER_CONFIG } from "./utils/constants.js";
import logger from "./utils/logger.js";

dotenv.config();
const app = express();
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) || [];

// Security middleware
app.use(securityHeaders);
app.use(compression());
app.use(express.json({ limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      logger.info(`Received request from origin: ${origin}`);
      logger.info(`Allowed origins: ${allowedOrigins.join(", ")}`);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        logger.info("No origin provided, allowing request");
        return callback(null, true);
      }

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        logger.info(`Origin ${origin} is allowed`);
        return callback(null, true);
      }

      // For development, allow all origins
      if (SERVER_CONFIG.NODE_ENV === "development") {
        logger.info("Development mode: allowing all origins");
        return callback(null, true);
      }

      logger.error(`Origin ${origin} is not allowed`);
      return callback(new Error(`Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api", cruxRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: SERVER_CONFIG.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${SERVER_CONFIG.NODE_ENV}`);
  logger.info(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
