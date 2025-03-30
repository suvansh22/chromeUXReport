import { body, validationResult } from "express-validator";
import { API_CONFIG, ERROR_MESSAGES } from "../utils/constants.js";

export const validateCruxRequest = [
  body("urls")
    .isArray()
    .withMessage("URLs must be an array")
    .notEmpty()
    .withMessage(ERROR_MESSAGES.NO_URLS)
    .isLength({ max: API_CONFIG.MAX_URLS_PER_REQUEST })
    .withMessage(ERROR_MESSAGES.TOO_MANY_URLS)
    .custom((urls) => {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      return urls.every((url) => urlPattern.test(url));
    })
    .withMessage(ERROR_MESSAGES.INVALID_URL),

  body("metrics").optional().isArray().withMessage("Metrics must be an array"),

  body("formFactor")
    .optional()
    .isString()
    .isIn(["Phone", "Desktop", "Tablet"])
    .withMessage("Form factor must be one of: Phone, Desktop, Tablet"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
