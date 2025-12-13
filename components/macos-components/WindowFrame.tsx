'use client';
import { motion } from 'framer-motion';
import { ReactNode, RefObject } from 'react';

interface WindowFrameProps {
  id: string;
  title: string;
  children: ReactNode;
  isActive: boolean;
  zIndex: number;
  onClose: () => void; // Sửa thành void để đơn giản hóa
  onFocus: () => void; // Sửa thành void
  initialPos?: { x: number; y: number };
  width?: string;
  height?: string;
  constraintsRef?: RefObject<HTMLDivElement>;
}

export default function WindowFrame({
  id,
  title,
  children,
  isActive,
  zIndex,
  onClose,
  onFocus,
  initialPos = { x: 0, y: 0 },
  width = "w-[800px]",
  height = "h-[500px]",
  constraintsRef
}: WindowFrameProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      initial={{ scale: 0.9, opacity: 0, x: initialPos.x, y: initialPos.y }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
      onPointerDown={onFocus}
      style={{ zIndex, position: 'absolute' }}
      className={`${width} ${height} rounded-xl overflow-hidden shadow-2xl border border-gray-500/30 bg-[#1e1e1e]/90 backdrop-blur-xl flex flex-col`}
    >
      {/* Title Bar */}
      <div
        className={`h-9 flex items-center px-4 justify-between select-none ${isActive ? 'bg-[#3a3a3a]/50' : 'bg-[#1e1e1e]/50'} border-b border-white/10`}
      >
        <div className="flex gap-2 group" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center hover:brightness-90 group">
             <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/60">✕</span>
          </button>
          <button className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] flex items-center justify-center hover:brightness-90 group">
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/60">−</span>
          </button>
          <button className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center hover:brightness-90 group">
            <span className="opacity-0 group-hover:opacity-100 text-[6px] font-bold text-black/60 pt-0.5">⤢</span>
          </button>
        </div>
        <span className="text-gray-300 text-xs font-medium font-sans flex items-center gap-2">{title}</span>
        <div className="w-14"></div>
      </div>
      {/* Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col cursor-auto" onPointerDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </motion.div>
  );
}