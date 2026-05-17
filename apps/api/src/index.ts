import dotenv from "dotenv";

import { createApp } from "./app.js";
import { startCronjob, fetchWeatherData } from "./cron/weather.js";
import { startPlanesCronjob, fetchPlaneData } from "./cron/planes.js";

dotenv.config();
const app = createApp();
const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);

  startPlanesCronjob();
  fetchPlaneData();

  startCronjob();
  fetchWeatherData();
});
