import type { Request, Response } from "express";
import {
  createCode,
  createSession,
  useCode,
  revokeToken,
  refreshSession,
} from "../services/desktop-auth.service.js";
import {
  desktopExchangeSchema,
  desktopLoginQuerySchema,
  desktopRefreshSchema,
  desktopRevokeSchema,
} from "../validation/desktop.validation.js";

function redirectAllowed(redirectUri: string) {
  try {
    const url = new URL(redirectUri);

    return (
      url.protocol === "http:" &&
      url.hostname === "127.0.0.1" &&
      url.pathname === "/callback"
    );
  } catch {
    return false;
  }
}

export async function login(req: Request, res: Response) {
  const query = desktopLoginQuerySchema.parse(req.query);

  if (!redirectAllowed(query.redirectUri)) {
    return res.status(400).json({
      message: "Invalid redirect!",
    });
  }

  const code = await createCode({
    userId: res.locals.userId,
    orgId: res.locals.orgId,
    state: query.state,
    redirectUri: query.redirectUri,
    codeChallenge: query.codeChallenge,
  });
  const callback = new URL(query.redirectUri);
  callback.searchParams.set("code", code);
  callback.searchParams.set("state", query.state);

  res.redirect(callback.toString());
}

export async function exchangeCode(req: Request, res: Response) {
  const body = desktopExchangeSchema.parse(req.body);

  const result = await useCode({
    code: body.code,
    state: body.state,
    verifier: body.codeVerifier,
  });
  const session = await createSession({
    userId: result.userId,
    orgId: result.orgId,
  });

  res.json({
    refreshToken: session.token,
    expiresAt: session.expiresAt.toISOString(),
  });
}

export async function refreshAppToken(req: Request, res: Response) {
  const body = desktopRefreshSchema.parse(req.body);
  const session = await refreshSession({
    token: body.refreshToken,
  });

  res.json({
    refreshToken: session.token,
    expiresAt: session.expiresAt.toISOString(),
  });
}

export async function revokeAppToken(req: Request, res: Response) {
  const body = desktopRevokeSchema.parse(req.body);

  if (body.refreshToken) {
    await revokeToken({
      token: body.refreshToken,
    });
  }

  res.json({
    message: "Session revoked!",
  });
}
