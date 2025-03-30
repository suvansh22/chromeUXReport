import { getAggregatedData } from "../../utils";
import { ApiError, URLData } from "../../utils/commonTypes";
import { API_CONFIG, ERROR_MESSAGES } from "../../utils/constants";

export const AVAILABLE_METRICS = [
  "cumulative_layout_shift",
  "experimental_time_to_first_byte",
  "first_contentful_paint",
  "interaction_to_next_paint",
  "largest_contentful_paint",
  "round_trip_time",
] as const;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createTimeoutPromise = () =>
  new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(ERROR_MESSAGES.API_TIMEOUT)),
      API_CONFIG.TIMEOUT
    )
  );

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    };
  }
  return {
    message: ERROR_MESSAGES.SERVER_ERROR,
    details: error,
  };
};

const fetchWithRetry = async (
  urls: string[],
  formFactor: string,
  retryCount = 0
): Promise<URLData[]> => {
  try {
    const response = await Promise.race([
      fetch(`${API_BASE_URL}/api/crux`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls, metrics: AVAILABLE_METRICS, formFactor }),
      }),
      createTimeoutPromise(),
    ]);

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const jsonResp: URLData[] = await response.json();
    return jsonResp;
  } catch (error) {
    if (retryCount < API_CONFIG.RETRY_COUNT) {
      await sleep(API_CONFIG.RETRY_DELAY * (retryCount + 1));
      return fetchWithRetry(urls, formFactor, retryCount + 1);
    }
    throw handleApiError(error);
  }
};

export const fetchCruxData = async (
  urls: string[],
  formFactor: string
): Promise<(string | number)[][]> => {
  try {
    const response = await fetchWithRetry(urls, formFactor);
    return getAggregatedData(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
};
