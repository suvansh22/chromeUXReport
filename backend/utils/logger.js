import winston from "winston";
import { SERVER_CONFIG } from "./constants.js";

// Create logger with environment-specific configuration
const logger = winston.createLogger({
  level: SERVER_CONFIG.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;
