import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { OWNER_COOKIE_NAME } from "@/lib/constants";
import { getOwnerPasscode } from "@/lib/env";
import { isValidOwnerSessionToken } from "@/lib/session-token";

export async function hasValidOwnerSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(OWNER_COOKIE_NAME)?.value;
  return isValidOwnerSessionToken(token, getOwnerPasscode());
}

export async function requireOwnerSession(request: NextRequest): Promise<NextResponse | null> {
  // Write endpoints call this helper so owner-only rules are enforced even if middleware changes.
  const isOwner = await hasValidOwnerSession(request);

  if (isOwner) {
    return null;
  }

  return NextResponse.json({ error: "Owner passcode required." }, { status: 401 });
}