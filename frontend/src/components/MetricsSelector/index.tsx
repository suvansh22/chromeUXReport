import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import { useCallback } from "react";
import { DeviceType } from "../../utils/commonTypes";

type Props = {
  metrics: string[];
  setMetrics: (metrics: string[]) => void;
  deviceType: string;
  setDeviceType: (factor: DeviceType) => void;
  setError: (err: string) => void;
};

const DEVICE_TYPE_MAP: Record<string, string> = {
  Desktop: "DESKTOP",
  Phone: "PHONE",
  Tablet: "TABLET",
} as const;

const availableDeviceTypeKey = Object.keys(DEVICE_TYPE_MAP);

const MetricsSelector = ({ deviceType, setDeviceType, setError }: Props) => {
  const updateSelect = useCallback(
    (e: SelectChangeEvent<string>) => {
      const value = e.target.value as DeviceType;
      setDeviceType(value);
      setError("");
    },
    [setDeviceType, setError]
  );
  return (
    <>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="deviceTypeSelectLabel">Device</InputLabel>
        <Select
          labelId="deviceTypeSelectLabel"
          id="deviceTypeSelect"
          value={deviceType}
          label="Device"
          onChange={updateSelect}
        >
          {availableDeviceTypeKey.map((factor) => (
            <MenuItem key={factor} value={factor}>
              {factor}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default MetricsSelector;
