import type { Metadata } from "next";

import "@/app/globals.css";

import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "LifeVault Reminder",
  description: "Track every important date before it becomes urgent."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
