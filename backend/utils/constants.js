export const API_CONFIG = {
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
  RATE_LIMIT_WINDOW_MS: 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  MAX_REQUEST_SIZE: "1mb",
  MAX_URLS_PER_REQUEST: 50,
};

export const SERVER_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const ERROR_MESSAGES = {
  NO_URLS: "Please enter at least one URL",
  TOO_MANY_URLS: "Too many URLs. Maximum allowed is 50",
  NETWORK_ERROR: "Network error occurred. Please try again",
  SERVER_ERROR: "Server error occurred. Please try again later",
  INVALID_URL: "Invalid URL format",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later",
  REQUEST_SIZE_EXCEEDED:
    "Request size exceeded. Please reduce the number of URLs",
};
