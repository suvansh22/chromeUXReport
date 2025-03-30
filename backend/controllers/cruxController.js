import { fetchCruxData } from "../services/cruxService.js";
import logger from "../utils/logger.js";

export const handleCruxRequest = async (req, res) => {
  const { urls = [], metrics = [], formFactor = "" } = req.body;
  const { CRUX_API_URL, CRUX_API_KEY } = process.env;

  if (!CRUX_API_URL || !CRUX_API_KEY) {
    logger.error("Missing required environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    logger.info(`Received request for ${urls.length} URLs`);
    const results = await fetchCruxData(
      urls,
      metrics,
      formFactor,
      CRUX_API_KEY,
      CRUX_API_URL
    );

    res.json(results);
  } catch (error) {
    logger.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
