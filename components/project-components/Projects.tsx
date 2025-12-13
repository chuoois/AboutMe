'use client';

import { useEffect, useState, useRef } from 'react';
import MacWindow from '@/components/macos-components/MacWindow';

// --- TYPE DEFINITIONS ---
type Repo = {
  id: number;
  title: string;
  icon: string;
  description: string;
  tags: string[];
  live_demo_url?: string;
  git_url?: string;
  color?: string; // Icon color
};

// --- MOCK DATA (HARD CODED) ---
const MOCK_REPOS: Repo[] = [
  {
    id: 1,
    title: "e-commerce-nextjs",
    icon: "bxs-shopping-bag",
    color: "text-blue-400",
    description: "A full-featured e-commerce platform built with Next.js 14, Stripe, and Tailwind CSS. Includes admin dashboard.",
    tags: ["Next.js", "TypeScript", "Stripe", "Zustand"],
    git_url: "#",
    live_demo_url: "#"
  },
  {
    id: 2,
    title: "spotify-clone",
    icon: "bxl-spotify",
    color: "text-green-500",
    description: "Pixel-perfect clone of Spotify Web Player. Features real-time music playback using Spotify SDK and lyrics sync.",
    tags: ["React", "Redux", "Node.js", "Spotify API"],
    git_url: "#",
    live_demo_url: "#"
  },
  {
    id: 3,
    title: "chat-app-realtime",
    icon: "bxs-message-dots",
    color: "text-purple-400",
    description: "Real-time messaging application using Socket.io and MongoDB. Supports group chats, file sharing, and E2E encryption.",
    tags: ["Socket.io", "Express", "MongoDB", "React"],
    git_url: "#",
    live_demo_url: "#"
  },
  {
    id: 4,
    title: "portfolio-macos-v1",
    icon: "bxl-apple",
    color: "text-gray-200",
    description: "My previous portfolio version inspired by macOS Big Sur. Built with pure CSS and vanilla JavaScript.",
    tags: ["HTML/CSS", "JavaScript", "Animation"],
    git_url: "#"
  },
  {
    id: 5,
    title: "weather-dashboard",
    icon: "bxs-cloud-rain",
    color: "text-yellow-400",
    description: "Weather forecast dashboard visualizing data from OpenWeatherMap API with Recharts graphs.",
    tags: ["React", "Recharts", "API Integration"],
    live_demo_url: "#"
  },
  {
    id: 6,
    title: "task-manager-api",
    icon: "bxs-server",
    color: "text-red-400",
    description: "Robust RESTful API for task management. Includes JWT authentication, rate limiting, and Docker support.",
    tags: ["NestJS", "PostgreSQL", "Docker", "Swagger"],
    git_url: "#"
  },
  {
    id: 7,
    title: "crypto-tracker",
    icon: "bxl-bitcoin",
    color: "text-orange-500",
    description: "Cryptocurrency price tracker with live updates via WebSocket. Shows historical data charts.",
    tags: ["Vue.js", "WebSocket", "Chart.js"],
    git_url: "#"
  },
  {
    id: 8,
    title: "blog-cms-headless",
    icon: "bxs-book-content",
    color: "text-pink-400",
    description: "Headless CMS for blogging built with Strapi and a Gatsby frontend.",
    tags: ["Strapi", "Gatsby", "GraphQL"],
    git_url: "#"
  }
];

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const limit = 6;
  const totalPages = Math.ceil(MOCK_REPOS.length / limit);

  // Simulate Data Fetching
  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      // Giả lập độ trễ mạng để hiển thị Skeleton
      await new Promise(r => setTimeout(r, 600)); 
      
      const start = (page - 1) * limit;
      const end = start + limit;
      setRepos(MOCK_REPOS.slice(start, end));
      setLoading(false);
    };

    loadRepos();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      {/* Container chính: Màu tối, Shadow đậm */}
      <MacWindow 
        title="~/projects — Finder" 
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white">

          {/* --- TOOLBAR (Finder Style) --- */}
          <div className="h-14 bg-[#252525] border-b border-white/10 flex items-center px-4 justify-between gap-4 shrink-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
              <i className='bx bxs-folder-open text-blue-400'></i>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-gray-200">projects</span>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-white">all</span>
            </div>

            {/* Search Bar */}
            <div className="relative w-48 md:w-64">
              <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'></i>
              <input
                disabled
                placeholder="Search"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-200 
                           placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-not-allowed"
              />
            </div>
          </div>

          {/* --- CONTENT AREA: GRID VIEW --- */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-[#1e1e1e] relative">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                // --- SKELETON LOADING (DARK MODE) ---
                Array.from({ length: limit }).map((_, idx) => (
                  <div key={idx} className="bg-[#252525] border border-white/5 rounded-xl p-5 h-48 animate-pulse">
                    <div className="flex justify-between mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-white/5 rounded-full"></div>
                      </div>
                    </div>
                    <div className="w-3/4 h-5 bg-white/10 rounded mb-3"></div>
                    <div className="w-full h-10 bg-white/5 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="w-16 h-5 bg-white/5 rounded-full"></div>
                      <div className="w-16 h-5 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                ))
              ) : (
                // --- REAL CARD ITEM ---
                repos.map(repo => (
                  <div
                    key={repo.id}
                    className="group relative bg-[#252525] border border-white/5 hover:border-blue-500/30 hover:bg-[#2a2a2a] 
                               rounded-xl p-5 transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-[#1e1e1e] border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`bx ${repo.icon} text-3xl ${repo.color}`}></i>
                      </div>
                      
                      {/* Action Buttons (Visible on Hover) */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
                        {repo.git_url && (
                          <a href={repo.git_url} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" title="Source Code">
                            <i className='bx bxl-github text-xl'></i>
                          </a>
                        )}
                        {repo.live_demo_url && (
                          <a href={repo.live_demo_url} className="p-2 hover:bg-blue-500/20 rounded-full text-gray-400 hover:text-blue-400 transition-colors" title="Live Demo">
                            <i className='bx bx-link-external text-xl'></i>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <h3 className="font-bold text-gray-100 text-base mb-2 group-hover:text-blue-400 transition-colors truncate">
                      {repo.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed h-10">
                      {repo.description}
                    </p>

                    {/* Card Footer: Tags */}
                    <div className="mt-auto flex gap-2 flex-wrap">
                      {repo.tags?.slice(0, 3).map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e1e1e] text-gray-400 border border-white/5 font-medium tracking-wide"
                        >
                          {t}
                        </span>
                      ))}
                      {repo.tags && repo.tags.length > 3 && (
                        <span className="text-[10px] px-2 py-1 text-gray-600">+ {repo.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --- STATUS BAR (Footer) --- */}
          <div className="h-9 bg-[#252525] border-t border-white/10 flex items-center justify-between px-4 text-xs select-none shrink-0">
            <div className="text-gray-500 font-mono">
              {MOCK_REPOS.length} items <span className="text-gray-700">|</span> {limit} per page
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                >
                  <i className='bx bx-chevron-left text-lg'></i>
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                >
                  <i className='bx bx-chevron-right text-lg'></i>
                </button>
              </div>
            </div>
          </div>

        </div>
      </MacWindow>
    </section>
  );
}