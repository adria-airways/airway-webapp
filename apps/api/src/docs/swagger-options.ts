import { openApiComponents } from "./schemas.js";

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
      ...openApiComponents,
      schemas: {
        ...openApiComponents.schemas,
        ErrorResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              example: "Weather station location not found!",
            },
          },
        },
        HealthResponse: {
          type: "object",
          required: ["ok", "message"],
          properties: {
            ok: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Healthy!",
            },
          },
        },
        WeatherLocation: {
          type: "object",
          required: ["id", "title", "country", "latitude", "longitude"],
          properties: {
            id: {
              type: "string",
              minLength: 1,
              maxLength: 16,
              example: "LJUBLJANA",
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 64,
              example: "Ljubljana",
            },
            country: {
              type: "string",
              minLength: 2,
              maxLength: 2,
              example: "SI",
            },
            latitude: {
              type: "number",
              minimum: -90,
              maximum: 90,
              example: 46.0569,
            },
            longitude: {
              type: "number",
              minimum: -180,
              maximum: 180,
              example: 14.5058,
            },
          },
        },
        CreateWeatherLocation: {
          type: "object",
          required: ["id", "title", "country", "latitude", "longitude"],
          properties: {
            id: {
              type: "string",
              minLength: 1,
              maxLength: 16,
              example: "LJUBLJANA",
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 64,
              example: "Ljubljana",
            },
            country: {
              type: "string",
              minLength: 2,
              maxLength: 2,
              example: "SI",
            },
            latitude: {
              type: "number",
              minimum: -90,
              maximum: 90,
              example: 46.0569,
            },
            longitude: {
              type: "number",
              minimum: -180,
              maximum: 180,
              example: 14.5058,
            },
          },
        },
        UpdateWeatherLocation: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 64,
              example: "Ljubljana",
            },
            country: {
              type: "string",
              minLength: 2,
              maxLength: 2,
              example: "SI",
            },
            latitude: {
              type: "number",
              minimum: -90,
              maximum: 90,
              example: 46.0569,
            },
            longitude: {
              type: "number",
              minimum: -180,
              maximum: 180,
              example: 14.5058,
            },
          },
        },
        WeatherReadingData: {
          type: "object",
          required: ["validAt"],
          properties: {
            validAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-19T12:00:00.000Z",
            },
            tempC: {
              type: "integer",
              example: 21,
            },
            tempMinC: {
              type: "integer",
              example: 16,
            },
            tempMaxC: {
              type: "integer",
              example: 24,
            },
            rhPct: {
              type: "integer",
              minimum: 0,
              maximum: 100,
              example: 68,
            },
            mslHpa: {
              type: "integer",
              example: 1016,
            },
            windKmh: {
              type: "integer",
              minimum: 0,
              example: 9,
            },
            gustKmh: {
              type: "integer",
              minimum: 0,
              example: 18,
            },
            windDir: {
              type: "string",
              maxLength: 2,
              example: "NE",
            },
            precipMm: {
              type: "number",
              minimum: 0,
              example: 0.4,
            },
            iconCode: {
              type: "string",
              maxLength: 32,
              example: "partly-cloudy",
            },
          },
        },
        WeatherReading: {
          allOf: [
            {
              $ref: "#/components/schemas/WeatherReadingData",
            },
            {
              type: "object",
              required: ["id", "locationId", "resolution", "fetchedAt"],
              properties: {
                id: {
                  type: "integer",
                  example: 42,
                },
                locationId: {
                  type: "string",
                  minLength: 1,
                  maxLength: 16,
                  example: "LJUBLJANA",
                },
                resolution: {
                  type: "string",
                  minLength: 1,
                  maxLength: 3,
                  example: "1h",
                },
                fetchedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-19T12:05:00.000Z",
                },
              },
            },
          ],
        },
        CreateWeatherReading: {
          allOf: [
            {
              $ref: "#/components/schemas/WeatherReadingData",
            },
            {
              type: "object",
              required: ["locationId", "resolution"],
              properties: {
                locationId: {
                  type: "string",
                  minLength: 1,
                  maxLength: 16,
                  example: "LJUBLJANA",
                },
                resolution: {
                  type: "string",
                  minLength: 1,
                  maxLength: 3,
                  example: "1h",
                },
              },
            },
          ],
        },
        UpdateWeatherReading: {
          type: "object",
          properties: {
            validAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-19T12:00:00.000Z",
            },
            tempC: {
              type: "integer",
              example: 21,
            },
            tempMinC: {
              type: "integer",
              example: 16,
            },
            tempMaxC: {
              type: "integer",
              example: 24,
            },
            rhPct: {
              type: "integer",
              minimum: 0,
              maximum: 100,
              example: 68,
            },
            mslHpa: {
              type: "integer",
              example: 1016,
            },
            windKmh: {
              type: "integer",
              minimum: 0,
              example: 9,
            },
            gustKmh: {
              type: "integer",
              minimum: 0,
              example: 18,
            },
            windDir: {
              type: "string",
              maxLength: 2,
              example: "NE",
            },
            precipMm: {
              type: "number",
              minimum: 0,
              example: 0.4,
            },
            iconCode: {
              type: "string",
              maxLength: 32,
              example: "partly-cloudy",
            },
          },
        },
        BulkWeatherReadings: {
          type: "object",
          required: ["resolution", "readings"],
          properties: {
            resolution: {
              type: "string",
              minLength: 1,
              maxLength: 3,
              example: "1h",
            },
            source: {
              type: "string",
              example: "ARSO",
            },
            readings: {
              type: "array",
              minItems: 1,
              maxItems: 500,
              items: {
                $ref: "#/components/schemas/WeatherReadingData",
              },
            },
          },
        },
        BulkWeatherReadingsResult: {
          type: "object",
          required: ["locationId", "resolution", "upserted"],
          properties: {
            locationId: {
              type: "string",
              example: "LJUBLJANA",
            },
            resolution: {
              type: "string",
              example: "1h",
            },
            upserted: {
              type: "integer",
              example: 24,
            },
          },
        },
        CurrentWeatherResponse: {
          type: "object",
          required: ["location", "current"],
          properties: {
            location: {
              $ref: "#/components/schemas/WeatherLocation",
            },
            current: {
              oneOf: [
                {
                  $ref: "#/components/schemas/WeatherReading",
                },
                {
                  type: "null",
                },
              ],
            },
          },
        },
        ForecastWeatherResponse: {
          type: "object",
          required: ["location", "forecast"],
          properties: {
            location: {
              $ref: "#/components/schemas/WeatherLocation",
            },
            forecast: {
              type: "array",
              items: {
                $ref: "#/components/schemas/WeatherReading",
              },
            },
          },
        },
        DesktopPingResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              example: "Desktop app is ready!",
            },
            userId: {
              type: "string",
              example: "user_123",
            },
            orgId: {
              type: "string",
              example: "org_123",
            },
          },
        },
      },
      securitySchemes: {
        ...openApiComponents.securitySchemes,
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
