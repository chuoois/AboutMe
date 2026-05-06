'use client';

import { useState, useEffect, memo } from 'react';
import { formatShortDate, formatTime } from '@/lib/helpers/date';

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 h-[22px] rounded-[4px] flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-all cursor-default">
      {children}
    </div>
  );
}

function MenuBar() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      setDate(new Date());
    }, 0);

    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [mounted]);

  return (
    <header className="fixed top-0 left-0 w-full h-[32px] 
      apple-nav saturate-150
      flex items-center justify-between px-2 sm:px-4 z-[9999] 
      text-white/90 text-[13px] font-medium select-none shadow-sm transition-colors duration-300"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-1 h-full">
        <MenuItem>
          <i className='bx bxl-apple text-[1.1rem]' />
        </MenuItem>
        <div className="hidden md:flex items-center font-normal text-white/90">
          <MenuItem>File</MenuItem>
          <MenuItem>Edit</MenuItem>
          <MenuItem>View</MenuItem>
          <MenuItem>Go</MenuItem>
          <MenuItem>Window</MenuItem>
          <MenuItem>Help</MenuItem>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 sm:gap-4 h-full">
        <div className="flex items-center gap-3 opacity-90">
          <div className="hidden sm:flex items-center gap-3">
            <i className='bx bx-wifi text-[1.1rem]' />
            <i className='bx bx-search text-[1.1rem]' />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] hidden lg:block text-white/80">100%</span>
            <i className='bx bxs-battery-charging text-[1.2rem] text-white' />
          </div>
          <div className="hidden sm:block">
            <i className='bx bx-slider-alt text-[1.1rem] rotate-90' />
          </div>
        </div>

        <div className="min-w-[130px] flex justify-end">
          {mounted && date ? (
            <span className="cursor-default hover:text-white/70 transition-colors">
              {formatShortDate(date)} &nbsp; {formatTime(date)}
            </span>
          ) : (
            <span className="opacity-0">Loading...</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default memo(MenuBar);
