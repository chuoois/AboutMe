import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VT323, Patrick_Hand, Space_Mono } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Header";
import MusicPlayer from "@/components/MusicPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thinh.Dev | Lofi Station",
  description: "Fullstack Dev & Chill Vibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} ${patrickHand.variable} ${spaceMono.variable}`}
      >
        <Header />
        <main>
          {children}
        </main>
        <MusicPlayer />
      </body>
    </html>
  );
}
