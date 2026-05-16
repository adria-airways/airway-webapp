import { Request, Response } from "express";
import * as planesService from "../services/planes.service.js";

export async function getLivePlanes(_req: Request, res: Response) {
  const data = await planesService.getLivePlanes();

  res.json({ data });
}

export async function getLivePlanesSlovenia(_req: Request, res: Response) {
  const data = await planesService.getLivePlanesSlovenia();

  res.json({ data });
}

export async function getLatestSnapshot(_req: Request, res: Response) {
  const latestSnapshot = await planesService.getLatestSnapshot();

  res.json({ latestSnapshot });
}

export async function getSnapshotById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "Invalid id",
    });
  }

  const data = await planesService.getSnapshotById(id);

  if (!data || data.length === 0) {
    return res.status(404).json({
      error: "Snapshot not found",
    });
  }

  res.json({ data });
}

export async function getSnapshotNavigation(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "Invalid id",
    });
  }

  const data = await planesService.getSnapshotNavigation(id);

  if (!data.currentSnapshot) {
    return res.status(404).json({
      error: "Snapshot not found",
    });
  }

  res.json({
    data: {
      previous: data.previous,
      next: data.next,
    },
  });
}