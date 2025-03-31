import { AVAILABLE_METRICS } from "../services/CruxApi";
import { URLData } from "./commonTypes";

const snakeToTitleCase = (snakeCaseStr: string): string => {
  return snakeCaseStr
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" ");
};

const compareArray = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((str, index) => str === sorted2[index]);
};

const getAggregatedData = (data: URLData[]) => {
  const aggregatedData: (string | number)[][] = [];
  const totalResults = data.length;
  const reportNotAvailable: Set<string> = new Set();
  AVAILABLE_METRICS.forEach((metric) => {
    let goodMetric = 0;
    let newImprovementMetric = 0;
    let poorMetric = 0;
    let p75Val = 0;
    data.forEach((metricData) => {
      if (
        !metricData?.data ||
        metricData.data[metric].histogram.length < 3 ||
        !metricData.data[metric]?.percentiles?.p75
      ) {
        reportNotAvailable.add(metricData.url);
      } else {
        goodMetric += metricData.data[metric].histogram[0].density;
        newImprovementMetric += metricData.data[metric].histogram[1].density;
        poorMetric += metricData.data[metric].histogram[2].density;
        p75Val += Number(metricData.data[metric].percentiles.p75);
      }
    });
    aggregatedData.push([
      metric,
      (goodMetric / totalResults).toFixed(2),
      (newImprovementMetric / totalResults).toFixed(2),
      (poorMetric / totalResults).toFixed(2),
      (p75Val / totalResults).toFixed(2),
    ]);
  });
  if (reportNotAvailable.size > 0) {
    throw new Error(
      `Chrome UX report not found for ${[...reportNotAvailable].join(",")}`
    );
  }
  return aggregatedData;
};

const isValidUrl = (url: string): boolean => {
  try {
    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return false;
    }
    const urlObject = new URL(url);
    return urlObject.hostname.includes(".");
  } catch {
    return false;
  }
};

export { compareArray, getAggregatedData, isValidUrl, snakeToTitleCase };
