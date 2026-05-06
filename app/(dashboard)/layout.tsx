import MenuBar from "@/components/layout/MenuBar";
import Dock from "@/components/layout/Dock";
import { IMG_LINKS } from "@/lib/constants/images";

/**
 * DASHBOARD LAYOUT — Wraps all admin/settings pages.
 * Same wallpaper + Dock + MenuBar as the rest of the app.
 */
export default function DashboardGroupLayout({
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
