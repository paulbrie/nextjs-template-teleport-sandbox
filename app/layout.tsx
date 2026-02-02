import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketPulse | Real-Time Stock Tracker",
  description: "Professional real-time stock market tracking with live prices, market data, and financial insights",
  keywords: ["stocks", "market", "finance", "trading", "real-time", "NVDA", "AMD", "GOOG", "AMZN"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-950`}
      >
        {children}
      </body>
    </html>
  );
}
