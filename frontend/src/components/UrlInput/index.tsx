import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { useCallback, useState } from "react";
import { ERROR_MESSAGES } from "../../utils/constants";
import { isValidUrl } from "../../utils/index";

type Props = {
  urls: string[];
  setUrls: (urls: string[]) => void;
  setError: (error: string) => void;
};

const UrlInput = ({ urls, setUrls, setError }: Props) => {
  const [inputUrl, setInputUrl] = useState("");

  const addUrl = useCallback(() => {
    if (!isValidUrl(inputUrl)) {
      setError(ERROR_MESSAGES.INVALID_URL);
      return;
    }
    if (urls.includes(inputUrl)) {
      setError(ERROR_MESSAGES.DUPLICATE_URLS);
      return;
    }
    if (inputUrl) {
      setUrls([...urls, inputUrl]);
      setInputUrl("");
    }
  }, [inputUrl, setError, setUrls, urls]);

  const removeUrl = useCallback(
    (urlToRemove: string) => {
      setUrls(urls.filter((url) => url !== urlToRemove));
    },
    [setUrls, urls]
  );

  return (
    <Box>
      <TextField
        fullWidth
        label="Enter URL"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
      />
      <Button variant="contained" onClick={addUrl} sx={{ mt: 2 }}>
        Add
      </Button>
      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {urls.map((url) => (
          <Chip key={url} label={url} onDelete={() => removeUrl(url)} />
        ))}
      </Box>
    </Box>
  );
};

export default UrlInput;
