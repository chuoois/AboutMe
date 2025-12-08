import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import MenuBar from "@/components/macos/MenuBar";
import Dock from "@/components/macos/Dock";
import MusicPlayer from "@/components/macos/MusicPlayer";
import { Inter } from "next/font/google";
import { IMG_LINKS } from "@/constants/img";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className={`${inter.className} antialiased`}>
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="h-dvh w-screen overflow-hidden bg-black text-white selection:bg-[#007AFF]/40 relative font-sans overscroll-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-700 ease-in-out transform scale-105 animate-wallpaper-zoom"
          style={{ backgroundImage: `url('${wallpaperUrl}')` }}
        >
          {/* Overlay tối nhẹ để icon trắng dễ đọc hơn */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[0px]" />
        </div>
        <main>
          {children}
        </main>
        <MusicPlayer />
        <MenuBar />
        <Dock />
      </body>
    </html>
  );
}