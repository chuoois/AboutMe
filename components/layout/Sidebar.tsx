"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";
import { authService } from "@/services/auth.service";
import { SIDEBAR_MENU_ITEMS } from "@/lib/constants/menu";

function Sidebar() {
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error", error);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <aside className="
      w-[260px] md:w-[280px] flex flex-col h-full select-none shrink-0
      bg-[#f6f6f8]/90 backdrop-blur-2xl
      border-r border-black/10
    ">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
          Settings
        </h1>
      </div>

      {/* Apple ID Profile */}
      <div className="px-3 mb-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors cursor-default group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:ring-black/10 transition-all">
            <Image
              src="https://cdn-media.sforum.vn/storage/app/media/THANHAN/avartar-anime-91.jpg"
              alt="Admin"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <span className="text-[13px] font-semibold text-[#1d1d1f] leading-tight truncate">
              Thinh Bui
            </span>
            <span className="text-[11px] text-[#86868b] truncate group-hover:text-[#424245] transition-colors">
              Apple ID, iCloud+ & Media
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-[2px] pb-4 no-scrollbar">
        {SIDEBAR_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.id}
              href={item.link}
              className={`
                group flex items-center gap-3 px-3 py-1.5 rounded-[6px] transition-all duration-200 text-[13px]
                ${isActive
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : "text-[#1d1d1f] hover:bg-black/5"
                }
              `}
            >
              <div className={`
                relative w-6 h-6 flex items-center justify-center shrink-0 rounded-[6px] shadow-sm
                ${item.color}
              `}>
                <div className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-white/30 to-transparent opacity-30" />
                <i className={`bx ${item.icon} text-[14px] text-white relative z-10 drop-shadow-sm`} />
              </div>
              <span className="truncate tracking-wide flex-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center gap-3 px-3 py-1.5 rounded-[6px] transition-all duration-200 text-[13px]
                     text-[#1d1d1f] hover:bg-black/5"
        >
          <div className="relative w-6 h-6 flex items-center justify-center shrink-0 rounded-[6px] shadow-sm bg-gradient-to-br from-orange-500 to-red-600">
            <div className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-white/30 to-transparent opacity-30" />
            <i className="bx bx-log-out text-[14px] text-white relative z-10 drop-shadow-sm" />
          </div>
          <span className="truncate tracking-wide flex-1">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-black/5 bg-transparent">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#86868b] font-mono opacity-60">
          <i className='bx bxl-apple text-sm mb-0.5' />
          <span>System Preferences v14.0</span>
        </div>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
