import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { verifyAccessToken } from "../auth/desktop-tokens.js";

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

export function requirePermission(permission: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({
        message: "You are required to be logged in!",
      });
    }

    if (!auth.orgId) {
      return res.status(403).json({
        message: "You are required to be in an organization!",
      });
    }

    if (!auth.has({ permission })) {
      return res.status(403).json({
        message: "You do not have permission for this!",
      });
    }

    res.locals.userId = auth.userId;
    res.locals.orgId = auth.orgId;

    next();
  };
}

export function requireAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Missing access token!",
    });
  }
  const token = authorization.slice("Bearer ".length);

  try {
    const data = verifyAccessToken(token);
    res.locals.userId = data.userId;
    res.locals.orgId = data.orgId;
    res.locals.authType = "desktop";

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid access token!",
    });
  }
}

function authenticateDesktopToken(req: Request, res: Response) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }
  const token = authorization.slice("Bearer ".length);
  const data = verifyAccessToken(token);

  res.locals.userId = data.userId;
  res.locals.orgId = data.orgId;
  res.locals.authType = "desktop";

  return true;
}

export function requireAccessPermission(permission: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      if (authenticateDesktopToken(req, res)) {
        return next();
      }
    } catch {
      return res.status(401).json({
        message: "Invalid access token!",
      });
    }

    return requirePermission(permission)(req, res, next);
  };
}
