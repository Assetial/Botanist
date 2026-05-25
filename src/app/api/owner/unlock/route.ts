import { NextRequest, NextResponse } from "next/server";
import { OWNER_COOKIE_MAX_AGE_SECONDS, OWNER_COOKIE_NAME } from "@/lib/constants";
import { getOwnerPasscode } from "@/lib/env";
import { createOwnerSessionToken } from "@/lib/session-token";

export async function POST(request: NextRequest) {
  let submittedPasscode = "";

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { passcode?: string };
    submittedPasscode = body.passcode?.trim() ?? "";
  } else {
    const form = await request.formData();
    submittedPasscode = String(form.get("passcode") ?? "").trim();
  }

  const passcode = getOwnerPasscode();
  if (!submittedPasscode || submittedPasscode !== passcode) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const token = await createOwnerSessionToken(passcode);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: OWNER_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: OWNER_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: OWNER_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}