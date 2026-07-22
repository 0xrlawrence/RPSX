import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

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
    "Prepaid RFID wallets for coffee shops, food parks, and canteens. One tap at the counter, zero cash to count.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${outfit.variable} ${geistMono.variable}`}
    >
      <body className="min-h-[100dvh]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
