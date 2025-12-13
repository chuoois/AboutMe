import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import MenuBar from "@/components/macos-components/MenuBar";
import Dock from "@/components/macos-components/Dock";
import MusicPlayer from "@/components/macos-components/MusicPlayer";
import { Inter } from "next/font/google";
import { IMG_LINKS } from "@/constants/img";

// 1. Cấu hình Font: Khai báo variable để dùng trong Tailwind
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Thinh.Dev | macOS Portfolio",
  description: "Fullstack Dev & Chill Vibes",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const wallpaperUrl = IMG_LINKS.mac_os;

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="h-dvh w-screen overflow-hidden bg-black text-mac-light-text dark:text-mac-dark-text selection:bg-mac-system-blue/40 relative font-sans overscroll-none">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] ease-out hover:scale-105"
          style={{ backgroundImage: `url('${wallpaperUrl}')` }}
        >
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[0px]" />
        </div>
        <main className="relative z-10 w-full h-full pt-9 pb-24 overflow-hidden">
          {children}
        </main>
        <div className="relative z-40">
          {/* <MusicPlayer /> */}
        </div>
        <div className="relative z-50">
          <MenuBar />
          <Dock />
        </div>

      </body>
    </html>
  );
}