import { DeviceEnum } from "./commonEnums";

type DeviceType = keyof typeof DeviceEnum;
type MetricsData = {
  urls: string[];
  Phone?: any[];
  Desktop?: any[];
  Tablet?: any[];
};

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
};

export type { DeviceType, MetricsData, URLData };
