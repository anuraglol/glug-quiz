import type { Metadata } from "next";

import { Geist_Mono, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-mono",
});

import "../index.css";

export const metadata: Metadata = {
  title: "quiz",
  description: "quiz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistMono.variable} antialiased font-mono`}>{children}</body>
    </html>
  );
}
