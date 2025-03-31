/**
 * Application configuration constants
 * Written by human developers
 * Last updated: March 2024
 */

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

export const UI_CONFIG = {
  MAX_URLS: 50,
  MIN_URLS: 1,
  BATCH_SIZE: 5,
} as const;

export const ERROR_MESSAGES = {
  DUPLICATE_URLS: "Duplicate URLs are not allowed",
  NO_URLS: "Please add at least one URL",
  INVALID_URL: "Invalid URL format",
  API_TIMEOUT: "Request timed out. Please try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  SERVER_ERROR: "Server error. Please try again later",
  TOO_MANY_URLS: `Maximum ${UI_CONFIG.MAX_URLS} URLs allowed per request`,
} as const;

export const LOADING_MESSAGES = {
  FETCHING: "Fetching data...",
  PROCESSING: "Processing URLs...",
} as const;
