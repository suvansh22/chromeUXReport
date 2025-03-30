import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { useCallback, useState } from "react";

type Props = {
  urls: string[];
  setUrls: (urls: string[]) => void;
};

const UrlInput = ({ urls, setUrls }: Props) => {
  const [inputUrl, setInputUrl] = useState("");

  const addUrl = useCallback(() => {
    if (inputUrl && !urls.includes(inputUrl)) {
      setUrls([...urls, inputUrl]);
      setInputUrl("");
    }
  }, [inputUrl, setUrls, urls]);

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
