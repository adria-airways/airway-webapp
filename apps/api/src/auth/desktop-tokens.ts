import crypto from "node:crypto";

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
