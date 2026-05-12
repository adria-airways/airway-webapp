import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { startCronjob, fetchWeatherData } from "./cron/weather.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Healthy!" });
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);

  startCronjob();
  fetchWeatherData();
});
