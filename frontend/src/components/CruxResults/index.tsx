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
import { debounce } from "@mui/material/utils";
import { useCallback, useState } from "react";
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

const CruxResults = ({ data, deviceType }: Props) => {
  const [extractedData, setExtractedData] = useState<any[]>(
    data?.[deviceType] ?? []
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<number[]>([]);
  const [threshold, setThreshold] = useState<string>("");

  const filterData = useCallback(
    (e: SelectChangeEvent<string>) => {
      if (!data?.[deviceType]) return;
      const filter = e.target.value;
      setSelectedFilter(filter);
      const filteredData: any[] = [];
      data[deviceType].forEach((metricData) => {
        if (snakeToTitleCase(metricData[0]) === filter || filter === "all") {
          filteredData.push(metricData);
        }
      });
      setExtractedData(filteredData);
    },
    [data, deviceType]
  );

  const sortData = useCallback(
    (selectedSortRow: number) => () => {
      if (!data?.[deviceType]) return;
      const [prevSortRow, prevSortOrder] = selectedSort;
      const order = selectedSortRow === prevSortRow ? !prevSortOrder : 0;
      setSelectedSort([selectedSortRow, Number(order)]);
      const sortedData = extractedData;
      sortedData.sort((a: any[], b: any[]) => {
        if (!order) {
          return a[selectedSortRow] - b[selectedSortRow];
        }
        return b[selectedSortRow] - a[selectedSortRow];
      });
      setExtractedData(sortedData);
    },
    [data, deviceType, extractedData, selectedSort]
  );

  const debouncedThresholdFilter = debounce((thresholdVal: number) => {
    if (!data?.[deviceType]) return;
    const filteredData = data[deviceType].filter(
      (val) => val[4] >= thresholdVal
    );
    setExtractedData([...filteredData]);
  });

  const thresholdFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const numVal = Number(e.target.value);
      const strVal = e.target.value;
      if (strVal !== "" && isNaN(numVal)) return;
      setThreshold(strVal);
      debouncedThresholdFilter(strVal.length > 0 ? numVal : 0);
    },
    [debouncedThresholdFilter]
  );

  return (
    <Box sx={{ mt: 2 }}>
      {data?.urls && data?.[deviceType] ? (
        <>
          <Select
            value={selectedFilter}
            onChange={filterData}
            defaultValue={"all"}
            fullWidth
          >
            <MenuItem key={"All"} value={"all"}>
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
          />
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tableHead}>Metric</TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead} ${styles.col1}`}
                    onClick={sortData(1)}
                  >
                    Good
                  </TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead} ${styles.col2}`}
                    onClick={sortData(2)}
                  >
                    Needs Improvement
                  </TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead} ${styles.col3}`}
                    onClick={sortData(3)}
                  >
                    Poor
                  </TableCell>
                  <TableCell
                    className={`${styles.cell} ${styles.tableHead}`}
                    onClick={sortData(4)}
                  >
                    75th Percentile
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {extractedData.map((metricData) => (
                  <TableRow key={metricData[0]}>
                    <TableCell>{snakeToTitleCase(metricData[0])}</TableCell>
                    <TableCell className={styles.col1}>
                      {(metricData[1] * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className={styles.col2}>
                      {(metricData[2] * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className={styles.col3}>
                      {(metricData[3] * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      {metricData[4]}{" "}
                      {metricData[0] === "cumulative_layout_shift" ? "" : "ms"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : null}
    </Box>
  );
};

export default CruxResults;
