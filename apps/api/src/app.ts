import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import routes from "./routes/index.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import swaggerRouter from "./docs/swagger.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(clerkMiddleware());

  app.use("/api", swaggerRouter);
  app.use("/api", routes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
