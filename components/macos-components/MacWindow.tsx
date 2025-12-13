'use client';

import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ReactNode, useState, useRef, useEffect } from 'react';

interface MacWindowProps {
  children?: ReactNode;
  title?: string;
  src?: string;
  className?: string;
}

export default function MacWindow({ 
  children, 
  title = "thinh_dev.app", 
  src, 
  className 
}: MacWindowProps) {
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
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          
          className={`
            pointer-events-auto flex flex-col relative overflow-hidden
            w-full md:w-[85%] max-w-6xl h-[80vh] 
            rounded-mac-window
            
            /* Background chính của cửa sổ */
            bg-mac-light-window/90 backdrop-blur-mac
            border border-mac-light-border
            shadow-mac-window
            
            /* Dark mode */
            dark:bg-mac-dark-window/90 dark:border-mac-dark-border
            dark:shadow-mac-window-dark
            
            transform-gpu will-change-transform
            ${className}
          `}
        >
          {/* --- HEADER (ĐÃ CẢI THIỆN ĐỘ TƯƠNG PHẢN) --- */}
          <div 
            className="h-11 flex items-center px-4 gap-4 shrink-0 select-none cursor-default z-20
                       border-b border-black/5 dark:border-white/10
                       /* Tăng độ đục của nền Header để dễ nhìn hơn */
                       bg-white/60 dark:bg-[#28282b]/80 backdrop-saturate-150"
            onPointerDown={(e) => dragControls.start(e)}
          >
            {/* 3 Nút Giao Thông (Trang trí) */}
            <div className="flex gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border-[#D89E24] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#28C840] border-[#1AAB29] shadow-sm" />
            </div>

            {/* Tiêu đề (Đậm hơn, rõ hơn) */}
            <div className={`flex-1 flex items-center justify-center min-w-0 pr-12 transition-opacity duration-200 pointer-events-none ${isDragging ? 'opacity-70' : 'opacity-100'}`}>
               <span className="font-semibold text-[13px] tracking-wide flex items-center gap-2 truncate
                                text-gray-900 dark:text-gray-100 drop-shadow-sm">
                {title === "Finder" ? (
                    <i className='bx bxs-face text-mac-system-blue text-lg'></i>
                ) : (
                    <i className='bx bxs-folder text-mac-system-blue text-lg'></i>
                )}
                {/* Bỏ opacity để chữ đen/trắng hoàn toàn */}
                <span className="truncate">{title}</span>
               </span>
            </div>
          </div>

          {/* --- PHẦN NỘI DUNG --- */}
          <div className="flex-1 relative overflow-hidden bg-mac-light-surface/40 dark:bg-mac-dark-surface/20">
            {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}

            {src ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 gap-2">
                    <div className="w-5 h-5 border-2 rounded-full animate-spin
                                    border-mac-light-subtext border-t-mac-light-text
                                    dark:border-mac-dark-subtext dark:border-t-mac-dark-text" />
                  </div>
                )}
                <iframe
                  src={src}
                  onLoad={() => setIsLoading(false)}
                  className={`w-full h-full border-none transition-opacity duration-500 
                              ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                  title={title}
                />
              </>
            ) : (
              <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar
                              text-mac-light-text dark:text-mac-dark-text">
                {children}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}