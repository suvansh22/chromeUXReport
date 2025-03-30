import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo, useState } from "react";
import { snakeToTitleCase } from "../../utils";
import { DeviceType, MetricsData } from "../../utils/commonTypes";
import styles from "./index.module.css";

type Props = {
  data: MetricsData | null;
  deviceType: DeviceType;
};

const FILTERS = [
  "First Contentful Paint",
  "Largest Contentful Paint",
  "Cumulative Layout Shift",
  "Experimental Time To First Byte",
  "Interaction To Next Paint",
] as const;

const METRIC_UNITS = {
  cumulative_layout_shift: "",
  first_contentful_paint: "ms",
  largest_contentful_paint: "ms",
  experimental_time_to_first_byte: "ms",
  interaction_to_next_paint: "ms",
} as const;

type MetricRow = [string, string, string, string, string];

const CruxResults = ({ data, deviceType }: Props) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<[number, number] | []>([]);
  const [threshold, setThreshold] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Memoize filtered data
  const filteredData = useMemo(() => {
    if (!data?.[deviceType]) return [];
    const aggregatedData = data[deviceType] as unknown as MetricRow[];
    return aggregatedData.filter(
      (metricData: MetricRow) =>
        snakeToTitleCase(metricData[0]) === selectedFilter ||
        selectedFilter === "all"
    );
  }, [data, deviceType, selectedFilter]);

  // Memoize sorted data
  const sortedData = useMemo(() => {
    if (!selectedSort.length) return filteredData;
    const [sortRow, order] = selectedSort;
    return [...filteredData].sort((a: MetricRow, b: MetricRow) => {
      const aVal = parseFloat(a[sortRow]);
      const bVal = parseFloat(b[sortRow]);
      return order ? bVal - aVal : aVal - bVal;
    });
  }, [filteredData, selectedSort]);

  // Memoize threshold filtered data
  const thresholdFilteredData = useMemo(() => {
    if (!threshold) return sortedData;
    const thresholdVal = Number(threshold);
    return sortedData.filter(
      (val: MetricRow) => parseFloat(val[4]) >= thresholdVal
    );
  }, [sortedData, threshold]);

  const filterData = useCallback((e: SelectChangeEvent<string>) => {
    setIsLoading(true);
    setSelectedFilter(e.target.value);
    setIsLoading(false);
  }, []);

  const sortData = useCallback(
    (selectedSortRow: number) => () => {
      const [prevSortRow, prevSortOrder] = selectedSort;
      const order = selectedSortRow === prevSortRow ? !prevSortOrder : 0;
      setSelectedSort([selectedSortRow, Number(order)]);
    },
    [selectedSort]
  );

  const thresholdFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value === "") {
        setThreshold("");
        return;
      }

      const numValue = Number(value);
      if (isNaN(numValue)) return;

      setThreshold(value);
    },
    []
  );

  const EmptyState = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h6">No data available</Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting your filters or fetching new data
      </Typography>
    </Box>
  );

  const SortIndicator = ({ column }: { column: number }) => {
    const [sortRow, order] = selectedSort;
    if (sortRow !== column) return "↕";
    return order ? "↑" : "↓";
  };

  const formatMetricValue = (value: string, metric: string) => {
    const unit = METRIC_UNITS[metric as keyof typeof METRIC_UNITS] || "ms";
    return `${value} ${unit}`;
  };

  return (
    <Box sx={{ mt: 2 }}>
      {data?.urls && data?.[deviceType] ? (
        <>
          <Select
            value={selectedFilter}
            onChange={filterData}
            defaultValue="all"
            fullWidth
            disabled={isLoading}
          >
            <MenuItem key="All" value="all">
              All
            </MenuItem>
            {FILTERS.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))}
          </Select>
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            label="Enter P75 threshold"
            value={threshold}
            onChange={thresholdFilter}
            type="number"
            disabled={isLoading}
          />
          <TableContainer
            component={Paper}
            sx={{ mt: 2 }}
            role="region"
            aria-label="Performance metrics table"
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={styles.tableHead}
                    role="columnheader"
                    aria-sort={
                      selectedSort[0] === 0
                        ? selectedSort[1]
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    Metric
                  </TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead} ${styles.col1}`}
                    onClick={sortData(1)}
                    role="columnheader"
                    aria-sort={
                      selectedSort[0] === 1
                        ? selectedSort[1]
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    Good <SortIndicator column={1} />
                  </TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead} ${styles.col2}`}
                    onClick={sortData(2)}
                    role="columnheader"
                    aria-sort={
                      selectedSort[0] === 2
                        ? selectedSort[1]
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    Needs Improvement <SortIndicator column={2} />
                  </TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead} ${styles.col3}`}
                    onClick={sortData(3)}
                    role="columnheader"
                    aria-sort={
                      selectedSort[0] === 3
                        ? selectedSort[1]
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    Poor <SortIndicator column={3} />
                  </TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead}`}
                    onClick={sortData(4)}
                    role="columnheader"
                    aria-sort={
                      selectedSort[0] === 4
                        ? selectedSort[1]
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    75th Percentile <SortIndicator column={4} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {thresholdFilteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <EmptyState />
                    </TableCell>
                  </TableRow>
                ) : (
                  thresholdFilteredData.map((metricData) => (
                    <TableRow key={metricData[0]}>
                      <TableCell>{snakeToTitleCase(metricData[0])}</TableCell>
                      <TableCell className={styles.col1}>
                        {(parseFloat(metricData[1]) * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className={styles.col2}>
                        {(parseFloat(metricData[2]) * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className={styles.col3}>
                        {(parseFloat(metricData[3]) * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        {formatMetricValue(metricData[4], metricData[0])}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : null}
    </Box>
  );
};

export default CruxResults;
