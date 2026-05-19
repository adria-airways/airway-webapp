import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { swaggerOptions } from "./swagger-options.js";

const swaggerRouter = Router();
const openApiSpec = swaggerJsdoc(swaggerOptions);

swaggerRouter.get("/openapi.json", (_req, res) => {
  res.json(openApiSpec);
});

swaggerRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default swaggerRouter;
