'use client';

import { useState, useEffect } from 'react';

export default function MenuBar() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  // Xử lý việc lấy thời gian chỉ chạy ở client để tránh lỗi Hydration
  useEffect(() => {
    setMounted(true);
    setDate(new Date()); // Set thời gian ngay lập tức khi mount

    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format ngày: "Tue Jun 20"
  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(d);
  };

  // Format giờ: "9:41 AM"
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[32px] 
      bg-[#1d1d1f]/30 dark:bg-black/40 backdrop-blur-2xl saturate-150
      flex items-center justify-between px-2 sm:px-4 z-[9999] 
      text-white/90 text-[13px] font-medium select-none shadow-sm transition-colors duration-300"
    >
      {/* --- LEFT SIDE --- */}
      <div className="flex items-center gap-1 h-full">
        {/* Apple Logo */}
        <MenuItem>
          <i className='bx bxl-apple text-[1.1rem]'></i>
        </MenuItem>

        {/* Menu Items */}
        <div className="hidden md:flex items-center font-normal text-white/90">
          <MenuItem>File</MenuItem>
          <MenuItem>Edit</MenuItem>
          <MenuItem>View</MenuItem>
          <MenuItem>Go</MenuItem>
          <MenuItem>Window</MenuItem>
          <MenuItem>Help</MenuItem>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex items-center gap-2 sm:gap-4 h-full">
        {/* Icons Group */}
        <div className="flex items-center gap-3 opacity-90">
          {/* Status Icons - Chỉ hiện trên màn hình lớn hơn mobile một chút */}
          <div className="hidden sm:flex items-center gap-3">
             <i className='bx bx-wifi text-[1.1rem]'></i>
             <i className='bx bx-search text-[1.1rem]'></i>
          </div>

          {/* Battery Icon (Static logic for demo) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] hidden lg:block text-white/80">100%</span>
            <i className='bx bxs-battery-charging text-[1.2rem] text-white'></i>
          </div>

          {/* Control Center Toggle */}
          <div className="hidden sm:block">
             <i className='bx bx-slider-alt text-[1.1rem] rotate-90'></i>
          </div>
        </div>

        {/* Clock */}
        <div className="min-w-[130px] flex justify-end">
            {mounted && date ? (
              <span className="cursor-default hover:text-white/70 transition-colors">
                {formatDate(date)} &nbsp; {formatTime(date)}
              </span>
            ) : (
              // Skeleton loading hoặc placeholder để tránh layout shift
              <span className="opacity-0">Loading...</span>
            )}
        </div>
      </div>
    </header>
  );
}

// Component con cho các mục Menu để code gọn hơn và style đồng nhất
function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 h-[22px] rounded-[4px] flex items-center justify-center hover:bg-white/20 active:bg-white/30 transition-all cursor-default">
      {children}
    </div>
  );
}