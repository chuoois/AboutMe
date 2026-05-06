'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { DOCK_APPS, type AppItem } from '@/lib/constants/menu';

interface DockIconProps {
  mouseX: MotionValue<number>;
  item: AppItem;
  onClick: (item: AppItem) => void;
}

const DockIcon = memo(function DockIcon({ mouseX, item, onClick }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [45, 90, 45]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 140, damping: 12 });

  return (
    <div className="relative flex flex-col items-center justify-end mb-2">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1
                       rounded-lg bg-gray-800/90 text-white
                       border border-white/10 shadow-xl backdrop-blur-md
                       text-xs font-medium whitespace-nowrap z-20 pointer-events-none"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        style={{ width, willChange: 'width' }}
        onClick={() => onClick(item)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.9 }}
        className="aspect-square rounded-2xl flex items-center justify-center relative 
                   focus:outline-none transform-gpu"
      >
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.colorClass} shadow-md transition-all duration-200`} />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-40 pointer-events-none" />
        <i className={`bx ${item.icon} text-3xl text-white relative z-10 antialiased transform-gpu`} />
        <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  );
});

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const router = useRouter();

  const onAppClick = useCallback((app: AppItem) => {
    if (!app.link) return;
    if (app.link.startsWith('http')) {
      window.open(app.link, '_blank');
    } else {
      router.push(app.link);
    }
  }, [router]);

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="pointer-events-auto flex items-end gap-3 px-4 pb-3 pt-4
                   apple-nav
                   border border-white/10
                   rounded-[24px] apple-shadow"
      >
        {DOCK_APPS.map((app) => (
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
