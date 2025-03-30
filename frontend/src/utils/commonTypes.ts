import { DeviceEnum } from "./commonEnums";

type DeviceType = keyof typeof DeviceEnum;

type HistogramBin = {
  start: number | string;
  end?: number | string;
  density: number;
};

type MetricData = {
  histogram: HistogramBin[];
  percentiles: { p75: number | string };
};

type URLData = {
  url: string;
  data: Record<string, MetricData>;
  error?: string;
};

type DeviceData = URLData[];

type MetricsData = {
  urls: string[];
  Phone?: (string | number)[][];
  Desktop?: (string | number)[][];
  Tablet?: (string | number)[][];
};

type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
};

export type { ApiError, DeviceData, DeviceType, MetricsData, URLData };
