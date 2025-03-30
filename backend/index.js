// backend/index.js
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const allowedOrigins = ["http://localhost:3000"];
const app = express();
app.use(express.json());
app.use(cors(allowedOrigins));

const CRUX_API_URL = process.env.CRUX_API_URL;
const API_KEY = process.env.CRUX_API_KEY;

app.post("/api/crux", async (req, res) => {
  const { urls = [], metrics = [], formFactor = "" } = req.body;
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "At least one URL is required" });
  }

  try {
    const results = await Promise.all(
      urls.map(async (url) => {
        const body = {
          url,
          metrics,
          ...(formFactor.length > 0 ? { formFactor } : {}),
        };
        try {
          const response = await axios.post(
            `${CRUX_API_URL}?key=${API_KEY}`,
            body
          );
          return { url, data: response.data.record.metrics || {} };
        } catch (error) {
          console.error(
            `Error fetching data for ${url}:`,
            error.response?.data || error.message
          );
          return { url, error: error.response?.data || "Failed to fetch data" };
        }
      })
    );
    res.json(results);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
