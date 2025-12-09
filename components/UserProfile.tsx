'use client';

import MacWindow from '@/components/macos/MacWindow';

// Mock data links
const SOCIAL_LINKS = {
  github: 'https://github.com',
  discord: 'https://discord.gg',
  facebook: 'https://facebook.com'
};

export default function UserProfile() {
  return (
    <section className="w-full h-full flex items-center justify-center p-4">

      <MacWindow title="~/users/thinh — -bash">
        <div className="flex flex-col md:flex-row h-full min-h-[500px]">

          {/* --- LEFT PANEL: Sidebar (macOS Light Sidebar) --- */}
          {/* Sử dụng màu nền sidebar chuẩn và border nhạt */}
          <div className="w-full md:w-[280px] bg-mac-light-sidebar backdrop-blur-xl border-r border-mac-light-border p-8 flex flex-col items-center justify-center text-center shrink-0 z-10">

            {/* Avatar with Glow Effect */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-32 h-32 rounded-full p-1 bg-white shadow-sm relative z-10 ring-1 ring-black/5">
                <img
                  src="https://cdn-media.sforum.vn/storage/app/media/THANHAN/avartar-anime-91.jpg"
                  className="w-full h-full rounded-full object-cover"
                  alt="Avatar"
                />
              </div>
            </div>

            {/* Name & Role */}
            <h1 className="text-xl font-bold text-mac-light-text mb-1 tracking-tight">Thinh Bui</h1>
            <p className="text-mac-light-subtext text-xs font-medium mb-8 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-mac-systemBlue"></span>
              Fullstack Developer
            </p>

            {/* Buttons (macOS Style) */}
            <div className="w-full space-y-3">
              <a
                href="mailto:contact@example.com"
                className="block w-full py-1.5 bg-mac-systemBlue hover:bg-[#0062cc] text-black hover:text-white rounded-md text-sm font-medium transition-all shadow-mac-btn active:scale-95"
              >
                Contact Me
              </a>
              <button className="block w-full py-1.5 bg-white hover:bg-gray-50 text-mac-light-text rounded-md text-sm font-medium transition-all border border-mac-light-border shadow-mac-btn active:scale-95">
                Download CV
              </button>
            </div>
          </div>

          {/* --- RIGHT PANEL: Content (White Background) --- */}
          <div className="w-full flex-1 p-8 flex flex-col relative bg-white overflow-hidden">

            {/* Intro Text */}
            <div className="mb-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-mac-light-text mb-3 tracking-tight">
                Hello, World.
              </h2>
              <p className="text-base text-mac-light-subtext leading-relaxed font-normal max-w-lg">
                Tôi viết code như viết nhật ký. Thích sự đơn giản, <span className="text-mac-light-text font-medium border-b border-mac-systemBlue/30">pixel-perfect</span> và cà phê sữa đá.
              </p>
            </div>

            {/* Terminal Widget (Dark Theme for Contrast) */}
            <div className="w-full flex-1 bg-[#1e1e1e] rounded-lg border border-black/10 shadow-2xl overflow-hidden font-mono text-sm relative group transform transition-transform hover:scale-[1.01] duration-500">
              {/* Terminal Header */}
              <div className="h-7 bg-[#2d2d2d] border-b border-white/5 flex items-center px-3 justify-between select-none">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="text-[10px] text-white/30 font-medium">bash — 80x24</span>
                <div className="w-10"></div> {/* Spacer for center alignment */}
              </div>

              {/* Terminal Body */}
              <div className="p-5 space-y-3 font-mono text-[13px] leading-6">
                <div className="flex gap-2">
                  <span className="text-green-400">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-gray-200">whoami</span>
                </div>
                <div className="text-gray-400 pl-4 border-l border-white/10 ml-1">
                  name: <span className="text-yellow-200">"Thinh Bui"</span><br />
                  role: <span className="text-yellow-200">"Fullstack Engineer"</span><br />
                  loves: [<span className="text-purple-300">"React"</span>, <span className="text-purple-300">"Node.js"</span>]
                </div>

                <div className="flex gap-2 pt-2">
                  <span className="text-green-400">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-gray-200">ls -la ./socials</span>
                </div>
                <div className="flex gap-6 pl-4 pt-1 ml-1">
                  {[
                    { href: SOCIAL_LINKS.github, icon: 'bxl-github', label: 'GitHub', color: 'hover:text-white' },
                    { href: SOCIAL_LINKS.discord, icon: 'bxl-discord', label: 'Discord', color: 'hover:text-indigo-400' },
                    { href: SOCIAL_LINKS.facebook, icon: 'bxl-facebook', label: 'Facebook', color: 'hover:text-blue-500' },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      className={`text-2xl text-gray-500 transition-all transform hover:-translate-y-1 ${social.color}`}
                      title={social.label}
                    >
                      <i className={`bx ${social.icon}`}></i>
                    </a>
                  ))}
                </div>

                {/* Typing Cursor */}
                <div className="flex gap-2 pt-2">
                  <span className="text-green-400">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="w-2 h-4 bg-gray-400 animate-pulse block"></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </MacWindow>
    </section>
  );
}