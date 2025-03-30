import { getAggregatedData } from "../../utils";
import { URLData } from "../../utils/commonTypes";

export const AVAILABLE_METRICS = [
  "cumulative_layout_shift",
  "experimental_time_to_first_byte",
  "first_contentful_paint",
  "interaction_to_next_paint",
  "largest_contentful_paint",
  "round_trip_time",
] as const;

export const fetchCruxData = async (urls: string[], formFactor: string) => {
  try {
    const response = await fetch("http://localhost:5000/api/crux", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls, metrics: AVAILABLE_METRICS, formFactor }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonResp: URLData[] = await response.json();
    const extractedData = getAggregatedData(jsonResp);
    return extractedData;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Unknown error occurred while fetching CrUX data");
  }
};
