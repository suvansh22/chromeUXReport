import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { lazy, Suspense, useCallback, useState } from "react";
import FallbackComponent from "../../components/Fallback";
import MetricsSelector from "../../components/MetricsSelector";
import UrlInput from "../../components/UrlInput";
import { fetchCruxData } from "../../services/CruxApi";
import { compareArray } from "../../utils";
import { DeviceType, MetricsData } from "../../utils/commonTypes";
import {
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  UI_CONFIG,
} from "../../utils/constants";

const CruxResults = lazy(() => import("../../components/CruxResults"));

const Home = () => {
  const [urls, setUrls] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [deviceType, setDeviceType] = useState<DeviceType>("Phone");
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchData = useCallback(async () => {
    if (urls.length === 0) {
      setError(ERROR_MESSAGES.NO_URLS);
      return;
    }

    if (urls.length > UI_CONFIG.MAX_URLS) {
      setError(ERROR_MESSAGES.TOO_MANY_URLS);
      return;
    }

    let areUrlsSame = false;
    if (data?.urls) {
      areUrlsSame = compareArray(urls, data.urls);
      // Only return cached data if URLs are exactly the same
      if (areUrlsSame && data?.[deviceType]) {
        return data[deviceType];
      }
    }

    setLoading(true);
    setError("");

    // If URLs are different, clear all data
    if (!areUrlsSame) {
      setData({
        urls,
        [deviceType]: null,
      });
    } else {
      // If URLs are same, only clear current device type data
      setData((prevData) => ({
        ...(prevData || {}),
        urls,
        [deviceType]: null,
      }));
    }

    try {
      const response = await fetchCruxData(urls, deviceType);
      setData((prevData) => ({
        ...(prevData || {}),
        urls,
        [deviceType]: response,
      }));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(ERROR_MESSAGES.SERVER_ERROR);
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
        {loading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            {LOADING_MESSAGES.FETCHING}
          </>
        ) : (
          "Fetch Data"
        )}
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
