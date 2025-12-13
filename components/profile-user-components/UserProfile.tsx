'use client';

import MacWindow from '@/components/macos-components/MacWindow';
import { SOCIAL_LINKS } from '@/constants/social';

export default function UserProfile() {
  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      
      {/* FIX 1: Thêm class 'dark' để ép dùng style tối.
         FIX 2: Tăng độ cao (md:h-[650px]) để thoáng hơn.
      */}
      <MacWindow 
        title="~/users/thinh — -zsh" 
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <div className="flex flex-col md:flex-row h-full w-full bg-[#1e1e1e]/90 backdrop-blur-2xl">

          {/* --- LEFT PANEL: Sidebar --- */}
          {/* FIX 3: Nền tối hẳn (bg-[#252525]) và giảm độ trong suốt để text không bị chìm */}
          <div className="w-full md:w-[260px] shrink-0 flex flex-col items-center pt-12 px-6 
                          border-b md:border-b-0 md:border-r border-white/10
                          bg-[#252525]/95 backdrop-blur-xl">
            
            {/* Avatar - Thêm viền trắng mờ để nổi trên nền tối */}
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-28 h-28 rounded-full p-[2px] bg-white/10 ring-1 ring-black/50 overflow-hidden">
                <img
                  src="https://cdn-media.sforum.vn/storage/app/media/THANHAN/avartar-anime-91.jpg"
                  className="w-full h-full rounded-full object-cover"
                  alt="Avatar"
                />
              </div>
            </div>

            {/* User Info - Chuyển hết text sang màu sáng (White/Gray-300) */}
            <div className="text-center w-full">
              <h1 className="text-xl font-bold text-white tracking-tight mb-1">
                Thinh Bui
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                 <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">
                  Fullstack Dev
                </p>
              </div>

              {/* Action Buttons - Style tối giản */}
              <div className="w-full space-y-3 pb-8 md:pb-0">
                <a
                  href="#"
                  className="flex items-center justify-center w-full py-2
                             bg-blue-600 hover:bg-blue-500 text-white rounded-lg
                             text-sm font-medium shadow-lg shadow-blue-900/20 transition-all 
                             active:scale-[0.98]"
                >
                  Contact Me
                </a>
                <button className="flex items-center justify-center w-full py-2
                                   bg-[#3a3a3a] hover:bg-[#454545] text-gray-200 
                                   border border-white/5 rounded-lg
                                   text-sm font-medium transition-all active:scale-[0.98]">
                  Download CV
                </button>
              </div>
            </div>
            
            <div className="mt-auto mb-6 hidden md:block text-[10px] text-gray-500 font-mono text-center">
              Git status: clean<br/>
              Branch: main
            </div>
          </div>

          {/* --- RIGHT PANEL: Main Content --- */}
          {/* FIX 4: Background tối màu (#1e1e1e) thay vì transparent */}
          <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]/60">
            
            <div className="p-8 md:p-12 h-full flex flex-col justify-center">
              
              {/* Introduction - Màu chữ trắng sáng */}
              <div className="mb-8 space-y-4 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">World.</span>
                </h2>
                <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-lg font-light">
                  Tôi viết code như viết nhật ký. Thích sự đơn giản, 
                  <span className="mx-1 text-white font-medium border-b border-blue-500/50">pixel-perfect</span> 
                  và cà phê sữa đá.
                </p>
              </div>

              {/* Terminal Widget - Nổi bật trên nền tối */}
              <div className="w-full bg-[#0d0d0d] rounded-xl shadow-2xl border border-white/10 overflow-hidden font-mono text-sm transform transition-all hover:scale-[1.01] duration-300">
                
                {/* Terminal Header */}
                <div className="h-8 bg-[#1a1a1a] flex items-center px-4 gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                  <div className="ml-2 text-xs text-gray-500 font-medium">bash — 80x24</div>
                </div>

                {/* Terminal Body */}
                <div className="p-5 space-y-4 text-[13px] md:text-[14px]">
                  
                  {/* Line 1 */}
                  <div>
                    <div className="flex gap-2">
                      <span className="text-green-400">➜</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-gray-200">whoami</span>
                    </div>
                    <div className="pl-4 mt-1 text-gray-400 border-l border-gray-700 ml-1.5">
                      <p>name: <span className="text-yellow-300">"Thinh Bui"</span></p>
                      <p>role: <span className="text-yellow-300">"Fullstack Engineer"</span></p>
                      <p>stack: <span className="text-purple-400">["Next.js", "React", "Node"]</span></p>
                    </div>
                  </div>

                  {/* Line 2 */}
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="text-green-400">➜</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-gray-200">ls -la ./socials</span>
                    </div>
                    <div className="flex gap-5 mt-2 pl-5">
                      {[
                         { href: SOCIAL_LINKS.github, icon: 'bxl-github', hover: 'hover:text-white' },
                         { href: SOCIAL_LINKS.discord, icon: 'bxl-discord', hover: 'hover:text-[#5865F2]' },
                         { href: SOCIAL_LINKS.facebook, icon: 'bxl-facebook', hover: 'hover:text-[#1877F2]' },
                      ].map((link, i) => (
                        <a key={i} href={link.href} className={`text-2xl text-gray-500 transition-colors ${link.hover}`}>
                          <i className={`bx ${link.icon}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>

                   {/* Typing Cursor */}
                   <div className="flex gap-2 items-center">
                      <span className="text-green-400">➜</span>
                      <span className="text-blue-400">~</span>
                      <span className="w-2 h-4 bg-gray-500 animate-pulse"></span>
                    </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </MacWindow>
    </section>
  );
}