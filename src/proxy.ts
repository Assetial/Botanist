import { NextResponse, type NextRequest } from "next/server";
import {
  OWNER_COOKIE_NAME,
  PRIVATE_API_PREFIXES,
  PRIVATE_PAGE_PREFIXES,
  PUBLIC_BYPASS_PATHS,
  SHARE_PATH_PREFIX,
} from "@/lib/constants";
import { getOwnerPasscode } from "@/lib/env";
import { isValidOwnerSessionToken } from "@/lib/session-token";

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public") ||
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

function isBypassedPath(pathname: string): boolean {
  if (PUBLIC_BYPASS_PATHS.includes(pathname)) {
    return true;
  }

  if (pathname.startsWith(`${SHARE_PATH_PREFIX}/`)) {
    return true;
  }

  return false;
}

function isPrivatePath(pathname: string): boolean {
  if (pathname === "/") {
    return true;
  }

  if (PRIVATE_PAGE_PREFIXES.some((prefix) => prefix !== "/" && pathname.startsWith(prefix))) {
    return true;
  }

  if (PRIVATE_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Share routes and unlock routes intentionally bypass owner checks for read-only/public access.
  if (isStaticAsset(pathname) || isBypassedPath(pathname) || !isPrivatePath(pathname)) {
    return NextResponse.next();
  }

  const passcode = getOwnerPasscode();
  const token = request.cookies.get(OWNER_COOKIE_NAME)?.value;
  const valid = await isValidOwnerSessionToken(token, passcode);

  if (valid) {
    return NextResponse.next();
  }

  // API requests get a strict 401 instead of redirect; write routes also re-check in each handler.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Owner passcode required." }, { status: 401 });
  }

  const unlockUrl = new URL("/owner/unlock", request.url);
  unlockUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(unlockUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
