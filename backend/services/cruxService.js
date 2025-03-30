import axios from "axios";
import logger from "../utils/logger.js";

const BATCH_SIZE = 5;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processBatch = async (urls, metrics, formFactor, apiKey, cruxApiUrl) => {
  const results = [];

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (url) => {
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const response = await axios.post(`${cruxApiUrl}?key=${apiKey}`, {
            url,
            metrics,
            ...(formFactor ? { formFactor } : {}),
          });
          return { url, data: response.data.record.metrics || {} };
        } catch (error) {
          retries++;
          if (retries === MAX_RETRIES) {
            logger.error(
              `Failed to fetch data for ${url} after ${MAX_RETRIES} retries:`,
              error.message
            );
            return {
              url,
              error: error.response?.data || "Failed to fetch data",
            };
          }
          await sleep(RETRY_DELAY * retries);
        }
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add a small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < urls.length) {
      await sleep(1000);
    }
  }

  return results;
};

export const fetchCruxData = async (
  urls,
  metrics,
  formFactor,
  apiKey,
  cruxApiUrl
) => {
  try {
    logger.info(`Processing ${urls.length} URLs`);
    const results = await processBatch(
      urls,
      metrics,
      formFactor,
      apiKey,
      cruxApiUrl
    );

    const successCount = results.filter((r) => !r.error).length;
    const failureCount = results.filter((r) => r.error).length;

    logger.info(
      `Completed processing: ${successCount} successful, ${failureCount} failed`
    );
    return results;
  } catch (error) {
    logger.error("Error in fetchCruxData:", error);
    throw new Error("Failed to process URLs");
  }
};
