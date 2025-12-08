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

// 1. Định nghĩa Type rõ ràng
interface AppItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  link: string;
}

const apps: AppItem[] = [
  { id: 'home', label: 'Home', icon: 'bxs-home', color: 'from-blue-400 to-blue-600', link: '/' },
  { id: 'profile', label: 'User Profile', icon: 'bxs-user-circle', color: 'from-blue-400 to-blue-600', link: '/profile' },
  { id: 'projects', label: 'Projects', icon: 'bxs-folder', color: 'from-green-400 to-green-600', link: '/repos' },
  { id: 'skills', label: 'Skills', icon: 'bx-brain', color: 'from-purple-400 to-purple-600', link: '/skills' },
  { id: 'credentials', label: 'Credentials', icon: 'bxs-badge-check', color: 'from-red-400 to-red-600', link: '/credentials' },
  { id: 'github', label: 'GitHub', icon: 'bxl-github', color: 'from-gray-400 to-gray-600', link: 'https://github.com/chuoois' },
];

interface DockIconProps {
  mouseX: MotionValue<number>;
  item: AppItem;
  onClick: (item: AppItem) => void;
}

function DockIcon({ mouseX, item, onClick }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setHovered] = useState(false);

  // 2. Tính toán khoảng cách
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // 3. Physics tinh chỉnh
  const widthSync = useTransform(distance, [-110, 0, 110], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative flex flex-col items-center justify-end group mb-2">
      {/* Tooltip FIXED CENTERED */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1
                       rounded-lg bg-gray-900/90 text-white text-xs font-semibold
                       whitespace-nowrap border border-white/10 shadow-xl
                       backdrop-blur-md z-20 pointer-events-none text-center"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Icon Button */}
      <motion.button
        ref={ref}
        style={{ width }}
        onClick={() => onClick(item)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.85 }}
        className="aspect-square rounded-2xl flex items-center justify-center relative 
                   focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={`Open ${item.label}`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-90 shadow-lg`}></div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-60"></div>

        {/* Icon */}
        <i className={`bx ${item.icon} text-3xl text-white relative z-10 drop-shadow-md`}></i>

        {/* Dấu chấm active */}
        <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        className="pointer-events-auto flex items-end gap-3 px-4 pb-3 pt-4 
                   bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10
                   rounded-3xl shadow-2xl"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
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
