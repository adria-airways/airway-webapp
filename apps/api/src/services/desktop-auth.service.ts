import { db, desktopCodes, desktopSessions, eq } from "db";
import {
  createToken,
  hashToken,
  addMinutes,
  addDays,
} from "../auth/desktop-tokens.js";

export async function createCode(input: {
  userId: string;
  orgId: string;
  state: string;
  redirectUri: string;
  codeChallenge: string;
}) {
  const code = createToken(32);

  await db.insert(desktopCodes).values({
    codeHash: hashToken(code),
    userId: input.userId,
    orgId: input.orgId,
    stateHash: hashToken(input.state),
    redirectUri: input.redirectUri,
    codeChallenge: input.codeChallenge,
    codeMethod: "S256",
    expiresAt: addMinutes(new Date(), 5),
  });

  return code;
}

function verifyCode(verifier: string, codeChallenge: string) {
  return hashToken(verifier) === codeChallenge;
}

export async function useCode(input: {
  code: string;
  state: string;
  verifier: string;
}) {
  const [entry] = await db
    .select()
    .from(desktopCodes)
    .where(eq(desktopCodes.codeHash, hashToken(input.code)))
    .limit(1);

  if (!entry) {
    throw new Error("Invalid code!");
  }
  if (entry.usedAt) {
    throw new Error("Code already used!");
  }
  if (entry.expiresAt <= new Date()) {
    throw new Error("Code expired!");
  }
  if (entry.stateHash !== hashToken(input.state)) {
    throw new Error("Invalid state!");
  }

  if (!verifyCode(input.verifier, entry.codeChallenge)) {
    throw new Error("Invalid code verifier!");
  }

  await db
    .update(desktopCodes)
    .set({ usedAt: new Date() })
    .where(eq(desktopCodes.id, entry.id));

  return {
    userId: entry.userId,
    orgId: entry.orgId,
  };
}

export async function createSession(input: {
  userId: string;
  orgId: string;
  deviceName?: string;
  appVersion?: string;
}) {
  const token = createToken(48);
  const expiresAt = addDays(new Date(), 30);

  await db.insert(desktopSessions).values({
    userId: input.userId,
    orgId: input.orgId,
    tokenHash: hashToken(token),
    deviceName: input.deviceName,
    appVersion: input.appVersion,
    expiresAt,
    lastUsedAt: new Date(),
  });

  return {
    token,
    expiresAt,
  };
}

export async function refreshSession(input: { token: string }) {
  const [session] = await db
    .select()
    .from(desktopSessions)
    .where(eq(desktopSessions.tokenHash, hashToken(input.token)))
    .limit(1);

  if (!session) {
    throw new Error("Invalid token!");
  }
  if (session.revokedAt) {
    throw new Error("Session revoked!");
  }
  if (session.expiresAt <= new Date()) {
    throw new Error("Session expired!");
  }

  const token = createToken(48);
  const expiresAt = addDays(new Date(), 30);

  await db
    .update(desktopSessions)
    .set({
      tokenHash: hashToken(token),
      expiresAt,
      lastUsedAt: new Date(),
    })
    .where(eq(desktopSessions.id, session.id));

  return {
    userId: session.userId,
    orgId: session.orgId,
    token,
    expiresAt,
  };
}

export async function revokeToken(input: { token: string }) {
  await db
    .update(desktopSessions)
    .set({
      revokedAt: new Date(),
    })
    .where(eq(desktopSessions.tokenHash, hashToken(input.token)));
}
