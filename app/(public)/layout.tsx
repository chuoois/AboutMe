import MenuBar from "@/components/layout/MenuBar";
import Dock from "@/components/layout/Dock";
import { IMG_LINKS } from "@/lib/constants/images";

/**
 * PUBLIC LAYOUT — Wraps all public portfolio pages.
 * 
 * PERFORMANCE: This layout persists across /home, /projects, /skills, /certification.
 * When navigating between these pages, only the `children` slot changes.
 * Dock, MenuBar, and wallpaper do NOT re-mount = instant transitions.
 * 
 * This is a SERVER COMPONENT — no "use client" needed because it just
 * renders the static shell. Dock and MenuBar are client components internally.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const wallpaperUrl = IMG_LINKS.mac_os;

  return (
    <>
      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] ease-out hover:scale-105"
        style={{ backgroundImage: `url('${wallpaperUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[0px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full h-full pt-9 pb-24 overflow-hidden">
        {children}
      </main>

      {/* Persistent UI Chrome */}
      <div className="relative z-50">
        <MenuBar />
        <Dock />
      </div>
    </>
  );
}
