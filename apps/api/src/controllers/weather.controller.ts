import type { NextFunction, Request, Response } from "express";

import * as weatherService from "../services/weather.service.js";
import {
  createLocationSchema,
  createReadingSchema,
  locationParameterSchema,
  readingIdParameterSchema,
  readingsQuerySchema,
  updateLocationSchema,
  updateReadingSchema,
} from "../validation/weather.validation.js";

export async function listLocations(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const locations = await weatherService.listLocations();
    res.json(locations);
  } catch (error) {
    next(error);
  }
}

export async function getLocation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = locationParameterSchema.parse(req.params);
    const location = await weatherService.getLocationWithId(params.id);

    if (!location) {
      return res.status(404).json({
        message: "Weather station location not found!",
      });
    }

    res.json(location);
  } catch (error) {
    next(error);
  }
}

export async function createLocation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = createLocationSchema.parse(req.body);
    const location = await weatherService.createLocation(body);

    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
}

export async function updateLocation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = locationParameterSchema.parse(req.params);
    const body = updateLocationSchema.parse(req.body);
    const location = await weatherService.updateLocation(params.id, body);

    if (!location) {
      return res.status(404).json({
        message: "Weather station location not found!",
      });
    }

    res.json(location);
  } catch (error) {
    next(error);
  }
}

export async function deleteLocation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = locationParameterSchema.parse(req.params);
    const location = await weatherService.deleteLocation(params.id);

    if (!location) {
      return res.status(404).json({
        message: "Weather station location not found!",
      });
    }

    res.json(location);
  } catch (error) {
    next(error);
  }
}

export async function listReadings(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = readingsQuerySchema.parse(req.query);
    const readings = await weatherService.listReadings(query);

    res.json(readings);
  } catch (error) {
    next(error);
  }
}

export async function getReading(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = readingIdParameterSchema.parse(req.params);
    const reading = await weatherService.getReadingWithId(params.id);

    if (!reading) {
      return res.status(404).json({
        message: "Weather reading not found!",
      });
    }

    res.json(reading);
  } catch (error) {
    next(error);
  }
}

export async function createReading(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = createReadingSchema.parse(req.body);
    const reading = await weatherService.createReading(body);

    res.status(201).json(reading);
  } catch (error) {
    next(error);
  }
}

export async function updateReading(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = readingIdParameterSchema.parse(req.params);
    const body = updateReadingSchema.parse(req.body);
    const reading = await weatherService.updateReading(params.id, body);

    if (!reading) {
      return res.status(404).json({
        message: "Weather reading not found!",
      });
    }

    res.json(reading);
  } catch (error) {
    next(error);
  }
}

export async function deleteReading(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = readingIdParameterSchema.parse(req.params);
    const reading = await weatherService.deleteReading(params.id);

    if (!reading) {
      return res.status(404).json({
        message: "Weather reading not found!",
      });
    }

    res.json(reading);
  } catch (error) {
    next(error);
  }
}
