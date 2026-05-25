import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Botanist",
  description: "Private plant care tracker for two people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-app text-stone-900">
          <AppHeader />
          <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
