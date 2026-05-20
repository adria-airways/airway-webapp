import { z } from "zod";

export const desktopLoginQuerySchema = z.object({
  redirectUri: z.string().url(),
  state: z.string().min(16).max(256),
  codee: z.string().min(43).max(128),
  codeMethod: z.literal("S256"),
});

export const desktopExchangeSchema = z.object({
  code: z.string().min(32).max(256),
  state: z.string().min(16).max(256),
  codeVerifier: z.string().min(43).max(128),
});

export const desktopRefreshSchema = z.object({
  refreshToken: z.string().min(32),
});

export const desktopRevokeSchema = z.object({
  refreshToken: z.string().min(32).optional(),
});
