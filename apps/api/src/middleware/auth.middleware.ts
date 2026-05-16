import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({
      message: "You are required to be logged in!",
    });
  }

  res.locals.userId = auth.userId;
  res.locals.orgId = auth.orgId;

  next();
}
