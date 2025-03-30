import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const FallbackComponent = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px" // or "100vh" for full viewport height
    >
      <CircularProgress />
    </Box>
  );
};
export default FallbackComponent;
