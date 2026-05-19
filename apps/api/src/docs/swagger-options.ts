export const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Airway API",
      version: "1.0.0",
      description: "REST API for Airway app",
    },
    servers: [
      {
        url: "/api",
        description: "Current server.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/docs/**/*.ts"],
};
