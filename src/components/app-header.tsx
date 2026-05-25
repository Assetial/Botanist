"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

function isReadOnlyShell(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }

  return pathname === "/owner/unlock" || pathname.startsWith("/share/");
}

export function AppHeader() {
  const pathname = usePathname();
  const readOnlyShell = isReadOnlyShell(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-200/60 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div>
          <Link href="/" className="font-display text-2xl font-semibold text-emerald-800">
            Botanist
          </Link>
          <p className="text-xs text-stone-600">Private plant care for two</p>
        </div>

        {readOnlyShell ? null : (
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-2 text-sm sm:flex">
              <Link href="/" className="rounded-full px-3 py-2 font-medium text-stone-700 hover:bg-emerald-50">
                Dashboard
              </Link>
              <Link
                href="/care"
                className="rounded-full px-3 py-2 font-medium text-stone-700 hover:bg-emerald-50"
              >
                Care
              </Link>
              <Link
                href="/plants/new"
                className="rounded-full px-3 py-2 font-medium text-stone-700 hover:bg-emerald-50"
              >
                Add Plant
              </Link>
            </nav>
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}