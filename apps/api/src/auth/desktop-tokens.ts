import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const tokenExpiry = 15 * 60;
type DesktopAccessData = {
  userId: string;
  orgId: string;
  type: "desktop_access";
};

function getDesktopSecret() {
  const secret = process.env.DESKTOP_TOKEN_SECRET;

  if (!secret) {
    throw new Error("DESKTOP_TOKEN_SECRET is needed!");
  }

  return secret;
}

export function createToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("base64url");
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60_000);
}

export function createAccessToken(input: { userId: string; orgId: string }) {
  return jwt.sign(
    {
      userId: input.userId,
      orgId: input.orgId,
      type: "desktop_access",
    } satisfies DesktopAccessData,
    getDesktopSecret(),
    {
      expiresIn: tokenExpiry,
    },
  );
}

export function verifyAccessToken(token: string) {
  const data = jwt.verify(token, getDesktopSecret());

  if (
    typeof data !== "object" ||
    data === null ||
    data.type !== "desktop_access" ||
    typeof data.userId !== "string" ||
    typeof data.orgId !== "string"
  ) {
    throw new Error("Invalid access token!");
  }

  return {
    userId: data.userId,
    orgId: data.orgId,
  };
}

export function getTokenExpiry() {
  return tokenExpiry;
}
