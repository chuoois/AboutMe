'use client';

import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ReactNode, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MacWindowProps {
  children?: ReactNode;
  title?: string;
  src?: string;
  onClose?: () => void;
  className?: string;
}

export default function MacWindow({ 
  children, 
  title = "thinh_dev.app", 
  src, 
  onClose, 
  className 
}: MacWindowProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!!src);
  const [isDragging, setIsDragging] = useState(false);
  
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();

  useEffect(() => {
    if (src) {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [src]);

  const handleClose = () => {
    if (onClose) onClose();
    else router.push('/');
  };

  return (
    <motion.div 
      ref={constraintsRef} 
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
    >
      <AnimatePresence>
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false} 
          dragConstraints={constraintsRef}
          dragElastic={0.05} 
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.2 } }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          
          className={`
            pointer-events-auto flex flex-col relative overflow-hidden
            w-full md:w-[85%] max-w-6xl h-[80vh] rounded-xl
            bg-mac-light-window backdrop-blur-3xl saturate-150
            border border-mac-light-border shadow-mac-window
            ${className}
          `}
        >
          {/* --- HEADER (ĐÃ SỬA LỖI VỊ TRÍ) --- */}
          <div 
            className="h-11 bg-gradient-to-b from-white/50 to-white/0 border-b border-mac-light-border flex items-center px-4 gap-4 shrink-0 select-none cursor-grab active:cursor-grabbing z-20"
            onPointerDown={(e) => dragControls.start(e)}
          >
            {/* 3 Nút Giao Thông */}
            <div className="flex gap-2 shrink-0">
              <TrafficLight type="close" onClick={handleClose} />
              <TrafficLight type="disabled" color="bg-[#FEBC2E] border-[#D89E24]" />
              <TrafficLight type="disabled" color="bg-[#28C840] border-[#1AAB29]" />
            </div>

            {/* Tiêu đề (Đã bỏ absolute, dùng flex-1 để tự đẩy sang trái) */}
            <div className={`flex-1 flex items-center min-w-0 transition-opacity duration-200 pointer-events-none ${isDragging ? 'opacity-60' : 'opacity-100'}`}>
               <span className="font-semibold text-[13px] text-mac-light-text/80 tracking-wide flex items-center gap-2 truncate">
                {title === "Finder" ? <i className='bx bxs-face text-blue-500 text-lg'></i> : <i className='bx bxs-folder text-blue-500 text-lg'></i>}
                <span className="truncate">{title}</span>
               </span>
            </div>
          </div>

          {/* --- PHẦN NỘI DUNG --- */}
          <div className="flex-1 relative bg-white/40 overflow-hidden">
            {/* Lớp phủ chặn iframe khi đang kéo */}
            {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}

            {src ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-400 gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  </div>
                )}
                <iframe
                  src={src}
                  onLoad={() => setIsLoading(false)}
                  className={`w-full h-full border-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                  title={title}
                />
              </>
            ) : (
              <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
                {children}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Component nút tròn nhỏ
function TrafficLight({ type, color, onClick }: { type: 'close' | 'disabled', color?: string, onClick?: () => void }) {
  if (type === 'close') {
    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center text-[8px] text-black/50 opacity-100 group-hover:opacity-100 hover:text-black transition-all cursor-pointer shadow-sm z-30"
      >
        <span className="opacity-0 group-hover:opacity-100 font-bold">✕</span>
      </div>
    );
  }
  return (
    <div className={`w-3 h-3 rounded-full ${color} border flex items-center justify-center opacity-40 cursor-default shadow-sm`} />
  );
}