import express from "express";
import rateLimit from "express-rate-limit";
import { handleCruxRequest } from "../controllers/cruxController.js";
import { validateCruxRequest } from "../middleware/validation.js";
import {
  API_CONFIG,
  ERROR_MESSAGES,
  SERVER_CONFIG,
} from "../utils/constants.js";

const router = express.Router();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: API_CONFIG.RATE_LIMIT_WINDOW_MS,
  max: API_CONFIG.RATE_LIMIT_MAX_REQUESTS,
  message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: SERVER_CONFIG.NODE_ENV,
  });
});

// Main CRUX endpoint with rate limiting and validation
router.post(
  "/crux",
  limiter,
  express.json({ limit: API_CONFIG.MAX_REQUEST_SIZE }), // Limit request body size
  validateCruxRequest,
  handleCruxRequest
);

export default router;
