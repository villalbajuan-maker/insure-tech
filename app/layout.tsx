import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Florida Policy Gap Analysis",
  description:
    "Upload Florida homeowners insurance policies, run a structured gap analysis, and receive a formatted report."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
