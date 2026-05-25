import { getOwnerSessionSalt } from "@/lib/env";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(message));
  return toHex(new Uint8Array(buffer));
}

export async function createOwnerSessionToken(passcode: string): Promise<string> {
  const salt = getOwnerSessionSalt();
  return sha256Hex(`${salt}:${passcode}`);
}

export async function isValidOwnerSessionToken(
  candidateToken: string | undefined,
  passcode: string,
): Promise<boolean> {
  if (!candidateToken) {
    return false;
  }

  const validToken = await createOwnerSessionToken(passcode);
  return candidateToken === validToken;
}