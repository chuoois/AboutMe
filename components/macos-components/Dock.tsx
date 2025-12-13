'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AppItem {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
  link: string;
}

const apps: AppItem[] = [
  { id: 'home', label: 'Home', icon: 'bxs-home', colorClass: 'from-blue-400 to-blue-600', link: '/home' },
  { id: 'projects', label: 'Projects', icon: 'bxs-folder-open', colorClass: 'from-green-400 to-emerald-500', link: '/projects' },
  { id: 'skills', label: 'Skills', icon: 'bxs-graduation', colorClass: 'from-purple-500 to-indigo-600', link: '/skills' },
  { id: 'certification', label: 'Certification', icon: 'bxs-certification', colorClass: 'from-red-500 to-pink-600', link: '/certification' },
  { id: 'github', label: 'GitHub', icon: 'bxl-github', colorClass: 'from-gray-600 to-slate-800', link: 'https://github.com/chuoois' },
  { id: 'settings', label: 'Settings', icon: 'bxs-cog', colorClass: 'from-yellow-400 to-orange-500', link: '/settings' },
];

interface DockIconProps {
  mouseX: MotionValue<number>;
  item: AppItem;
  onClick: (item: AppItem) => void;
}

function DockIcon({ mouseX, item, onClick }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setHovered] = useState(false);

  // Tính toán khoảng cách chuột
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // widthSync: mapping khoảng cách ra độ rộng
  const widthSync = useTransform(distance, [-150, 0, 150], [45, 90, 45]);
  
  // Spring: Giảm stiffness và damping nhẹ để mượt hơn, giảm tải tính toán
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 140, damping: 12 });

  return (
    <div className="relative flex flex-col items-center justify-end mb-2">
      {/* Tooltip: Chỉ render khi hover để giảm tải DOM */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }} // Animation nhanh gọn
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1
                       rounded-lg
                       bg-gray-800/90 text-white
                       border border-white/10
                       shadow-xl backdrop-blur-md
                       text-xs font-medium whitespace-nowrap z-20 pointer-events-none"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        style={{ width, willChange: 'width' }} // QUAN TRỌNG: will-change giúp browser tối ưu
        onClick={() => onClick(item)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.9 }}
        className="aspect-square rounded-2xl flex items-center justify-center relative 
                   focus:outline-none 
                   transform-gpu" // QUAN TRỌNG: Ép dùng GPU
      >
        {/* Background Layer: Tách riêng để tối ưu repaint */}
        <div 
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.colorClass} 
                        shadow-md transition-all duration-200`} 
        />
        
        {/* Shine Effect nhẹ (đã bỏ shadow phức tạp) */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-40 pointer-events-none" />

        {/* Icon: Đã bỏ drop-shadow-md (nguyên nhân chính gây lag) */}
        <i className={`bx ${item.icon} text-3xl text-white relative z-10 antialiased transform-gpu`} />

        {/* Dot indicator */}
        <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const router = useRouter();

  const onAppClick = (app: AppItem) => {
    if (!app.link) return;
    if (app.link.startsWith('http')) {
      window.open(app.link, '_blank');
    } else {
      router.push(app.link);
    }
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        
        // Container chính: Giữ shadow và blur ở đây vì nó ít thay đổi kích thước hơn
        className="pointer-events-auto flex items-end gap-3 px-4 pb-3 pt-4
                   bg-mac-light-window/80 dark:bg-mac-dark-window/80
                   backdrop-blur-xl
                   border border-mac-light-border dark:border-mac-dark-border
                   rounded-[24px] 
                   shadow-2xl" 
      >
        {apps.map((app) => (
          <DockIcon
            key={app.id}
            mouseX={mouseX}
            item={app}
            onClick={onAppClick}
          />
        ))}
      </motion.div>
    </div>
  );
}