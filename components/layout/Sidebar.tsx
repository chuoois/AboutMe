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
      bg-[#262626]/95 backdrop-blur-2xl
      border-r border-black/20
    ">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Settings
        </h1>
      </div>

      {/* Apple ID Profile */}
      <div className="px-3 mb-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-default group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
            <Image
              src="https://cdn-media.sforum.vn/storage/app/media/THANHAN/avartar-anime-91.jpg"
              alt="Admin"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <span className="text-[13px] font-semibold text-white leading-tight truncate">
              Thinh Bui
            </span>
            <span className="text-[11px] text-gray-500 truncate group-hover:text-gray-400 transition-colors">
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
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
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
                     text-gray-300 hover:bg-white/5 hover:text-white"
        >
          <div className="relative w-6 h-6 flex items-center justify-center shrink-0 rounded-[6px] shadow-sm bg-gradient-to-br from-orange-500 to-red-600">
            <div className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-white/30 to-transparent opacity-30" />
            <i className="bx bx-log-out text-[14px] text-white relative z-10 drop-shadow-sm" />
          </div>
          <span className="truncate tracking-wide flex-1">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5 bg-transparent">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600 font-mono opacity-60">
          <i className='bx bxl-apple text-sm mb-0.5' />
          <span>System Preferences v14.0</span>
        </div>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
