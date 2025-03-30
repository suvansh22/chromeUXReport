import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { lazy, Suspense, useCallback, useState } from "react";
import FallbackComponent from "../../components/Fallback";
import MetricsSelector from "../../components/MetricsSelector";
import UrlInput from "../../components/UrlInput";
import { fetchCruxData } from "../../services/CruxApi";
import { compareArray } from "../../utils";
import { DeviceType, MetricsData } from "../../utils/commonTypes";
const CruxResults = lazy(() => import("../../components/CruxResults"));

const mockData = {
  urls: ["https://www.hotstar.com/in/home"],
  Phone: [
    ["first_contentful_paint", 0.735, 0.1487, 0.1163, 1872],
    ["largest_contentful_paint", 0.2053, 0.2288, 0.5659, 7340],
    ["cumulative_layout_shift", 0.4419, 0.2497, 0.3083, "0.32"],
    ["experimental_time_to_first_byte", 0.7116, 0.1905, 0.098, 916],
    ["interaction_to_next_paint", 0.6065, 0.2927, 0.1008, 282],
  ],
};

const Home = () => {
  const [urls, setUrls] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [deviceType, setDeviceType] = useState<DeviceType>("Phone");
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchData = useCallback(async () => {
    if (urls.length === 0) {
      setError("Please add some urls.");
      return;
    }
    let areUrlsSame = false;
    if (data?.urls) {
      areUrlsSame = compareArray(urls, data.urls);
      if (areUrlsSame && data?.[deviceType]) {
        return data[deviceType];
      }
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetchCruxData(urls, deviceType);
      setData({
        ...(areUrlsSame ? data : {}),
        urls,
        [deviceType]: response,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [data, deviceType, urls]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chrome UX Report Fetcher
      </Typography>
      <UrlInput urls={urls} setUrls={setUrls} />
      <MetricsSelector
        metrics={metrics}
        setMetrics={setMetrics}
        deviceType={deviceType}
        setDeviceType={setDeviceType}
        setError={setError}
      />
      <Button
        variant="contained"
        onClick={handleFetchData}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Fetch Data"}
      </Button>
      {error && (
        <Typography sx={{ mt: 2 }} color="error">
          {error}
        </Typography>
      )}
      <Suspense fallback={<FallbackComponent />}>
        {data?.[deviceType] && (
          <CruxResults data={data} deviceType={deviceType} />
        )}
      </Suspense>
    </Container>
  );
};

export default Home;
