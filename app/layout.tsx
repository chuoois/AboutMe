import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

// Font: configured once at root level — shared by all routes
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

/**
 * ROOT LAYOUT — Minimal. Only fonts + global styles.
 * 
 * PERFORMANCE: No Dock/MenuBar here. Those are pushed down to
 * (public) layout so they don't mount/unmount on auth pages.
 * This prevents full layout re-renders when navigating between
 * route groups (public <-> auth <-> dashboard).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        {/* Boxicons: loaded via preconnect for faster fetch */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="h-dvh w-screen overflow-hidden bg-black text-mac-light-text dark:text-mac-dark-text selection:bg-mac-system-blue/40 relative font-sans overscroll-none">
        {children}
      </body>
    </html>
  );
}