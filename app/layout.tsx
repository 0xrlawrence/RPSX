import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RPSX. Cashless RFID payments for venues",
  description:
    "Run your coffee shop, food park, or canteen on tap-to-pay RFID cards. Multi-tenant, secure, and live in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistMono.variable}`}>
      <body className="min-h-[100dvh]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
