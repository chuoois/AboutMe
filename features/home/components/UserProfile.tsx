'use client';

import Image from 'next/image';
import MacWindow from '@/components/layout/MacWindow';
import { SOCIAL_LINKS } from '@/lib/constants/social';

export default function UserProfile() {
  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <MacWindow 
        title="~/users/thinh — -zsh" 
        className="max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <div className="flex flex-col md:flex-row h-full w-full bg-white/50">
          {/* LEFT PANEL: Sidebar */}
          <div className="w-full md:w-[260px] shrink-0 flex flex-col items-center pt-12 px-6 
                          border-b md:border-b-0 md:border-r border-black/5
                          bg-[#f6f6f8]/90 backdrop-blur-xl">
            {/* Avatar */}
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-50 blur group-hover:opacity-100 transition duration-500" />
              <div className="relative w-28 h-28 rounded-full p-[2px] bg-white/10 ring-1 ring-black/50 overflow-hidden">
                <Image
                  src="https://cdn-media.sforum.vn/storage/app/media/THANHAN/avartar-anime-91.jpg"
                  className="w-full h-full rounded-full object-cover"
                  alt="Avatar"
                  width={112}
                  height={112}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center w-full">
              <h1 className="apple-h3 font-bold text-[#1d1d1f] tracking-tight mb-1">
                Thinh Bui
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <p className="text-gray-400 apple-micro font-mono uppercase tracking-widest">
                  Fullstack Dev
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3 pb-8 md:pb-0">
                <a
                  href="#"
                  className="flex items-center justify-center w-full apple-btn-primary apple-shadow"
                >
                  Contact Me
                </a>
                <button className="flex items-center justify-center w-full apple-btn-secondary border border-black/5 bg-[#1d1d1f] text-white">
                  Download CV
                </button>
              </div>
            </div>
            
            <div className="mt-auto mb-6 hidden md:block apple-micro text-gray-500 font-mono text-center">
              Git status: clean<br/>
              Branch: main
            </div>
          </div>

          {/* RIGHT PANEL: Main Content */}
          <div className="flex-1 relative overflow-hidden apple-section-light bg-white/20">
            <div className="p-8 md:p-12 h-full flex flex-col justify-center">
              {/* Introduction */}
              <div className="mb-8 space-y-4 relative z-10">
                <h2 className="apple-h1 text-[#1d1d1f]">
                  Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">World.</span>
                </h2>
                <p className="apple-body text-[#86868b] leading-relaxed max-w-lg font-light">
                  Tôi viết code như viết nhật ký. Thích sự đơn giản, 
                  <span className="mx-1 text-[#1d1d1f] font-medium border-b border-blue-500/50">pixel-perfect</span> 
                  và cà phê sữa đá.
                </p>
              </div>

              {/* Terminal Widget */}
              <div className="w-full bg-[#f5f5f7] rounded-xl apple-shadow border border-black/5 overflow-hidden font-mono text-sm transform transition-all hover:scale-[1.01] duration-300">
                {/* Terminal Header */}
                <div className="h-8 bg-[#e5e5e7] flex items-center px-4 gap-2 border-b border-black/5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <div className="ml-2 apple-micro text-gray-500 font-medium">bash — 80x24</div>
                </div>

                {/* Terminal Body */}
                <div className="p-5 space-y-4 text-[13px] md:text-[14px]">
                  {/* Line 1 */}
                  <div>
                    <div className="flex gap-2">
                      <span className="text-green-600">➜</span>
                      <span className="text-blue-600">~</span>
                      <span className="text-[#1d1d1f]">whoami</span>
                    </div>
                    <div className="pl-4 mt-1 text-[#86868b] border-l border-gray-300 ml-1.5">
                      <p>name: <span className="text-orange-600">&quot;Thinh Bui&quot;</span></p>
                      <p>role: <span className="text-orange-600">&quot;Fullstack Engineer&quot;</span></p>
                      <p>stack: <span className="text-purple-600">[&quot;Next.js&quot;, &quot;React&quot;, &quot;Node&quot;]</span></p>
                    </div>
                  </div>

                  {/* Line 2 */}
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="text-green-600">➜</span>
                      <span className="text-blue-600">~</span>
                      <span className="text-[#1d1d1f]">ls -la ./socials</span>
                    </div>
                    <div className="flex gap-5 mt-2 pl-5">
                      {[
                        { href: SOCIAL_LINKS.github, icon: 'bxl-github', hover: 'hover:text-white' },
                        { href: SOCIAL_LINKS.discord, icon: 'bxl-discord', hover: 'hover:text-[#5865F2]' },
                        { href: SOCIAL_LINKS.facebook, icon: 'bxl-facebook', hover: 'hover:text-[#1877F2]' },
                      ].map((link: { href: string; icon: string; hover: string }, i: number) => (
                        <a key={i} href={link.href} className={`text-2xl text-gray-500 transition-colors ${link.hover}`}>
                          <i className={`bx ${link.icon}`} />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Typing Cursor */}
                  <div className="flex gap-2 items-center">
                    <span className="text-green-600">➜</span>
                    <span className="text-blue-600">~</span>
                    <span className="w-2 h-4 bg-[#1d1d1f] animate-pulse" />
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
