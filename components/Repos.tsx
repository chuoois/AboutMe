'use client';

import { useEffect, useState, useRef } from 'react';
import MacWindow from '@/components/macos/MacWindow';
import { fetchData } from '@/lib/fetchdata';

type Repo = {
  id: number;
  title: string;
  icon: string;
  description: string;
  tags: string[];
  title_color?: string;
  live_demo_url?: string;
  git_url?: string;
};

export default function Repos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const limit = 6;

  useEffect(() => {
    async function loadRepos() {
      setLoading(true);
      try {
        const start = Date.now();
        const res = await fetchData(`/api/repos?page=${page}&limit=${limit}`);
        const data = res.data || (Array.isArray(res) ? res : []);
        const total = res.totalPages || res.total || 1;

        const elapsed = Date.now() - start;
        if (elapsed < 300) await new Promise(r => setTimeout(r, 300 - elapsed));

        setRepos(data);
        setTotalPages(total);
      } catch (err) {
        console.error("Failed to fetch repos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRepos();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full h-full flex items-center justify-center p-4">
      <MacWindow title="~/projects — -bash">

        {/* HEADER: TOOLBAR (Finder Style) */}
        <div className="h-12 bg-mac-light-sidebar border-b border-mac-light-border backdrop-blur-md flex items-center px-4 justify-between gap-4">
          <div className="flex items-center gap-2 text-mac-light-subtext text-sm">
            <i className='bx bx-folder'></i>
            <span className="font-medium text-mac-light-text">/ projects</span>
          </div>

          <div className="relative flex-1 max-w-xs">
            <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-mac-light-subtext text-sm'></i>
            <input
              disabled
              placeholder="Search in folder..."
              className="w-full bg-white border border-mac-light-border shadow-sm rounded-md py-1.5 pl-9 pr-3 text-xs text-mac-light-text focus:outline-none focus:ring-2 focus:ring-mac-systemBlue/20 focus:border-mac-systemBlue placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>

        {/* CONTENT AREA: LIST/GRID VIEW */}
        <div ref={scrollRef} className="h-[500px] overflow-y-auto bg-white p-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Skeleton Loading (Light Mode)
              Array.from({ length: limit }).map((_, idx) => (
                <div key={idx} className="bg-gray-100 border border-gray-200 rounded-lg p-4 h-48 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-full h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : repos.length === 0 ? (
              // Empty State (Light Mode)
              <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-400 mt-20">
                <i className='bx bx-folder-open text-6xl mb-2 text-gray-300'></i>
                <p>Folder Empty</p>
              </div>
            ) : (
              // Card Item (Light Mode)
              repos.map(repo => (
                <div
                  key={repo.id}
                  className="group bg-white border border-mac-light-border shadow-mac-btn hover:bg-mac-systemBlue/5 hover:border-mac-systemBlue/30 rounded-lg p-4 transition-all duration-200 flex flex-col cursor-default"
                >
                  <div className="flex items-start justify-between mb-3">
                    <i className={`bx ${repo.icon || "bx-folder"} text-4xl text-mac-systemBlue drop-shadow-sm group-hover:scale-110 transition-transform`}></i>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {repo.git_url && (
                        <a href={repo.git_url} target="_blank" className="text-mac-light-subtext hover:text-black transition-colors" title="View Code">
                          <i className='bx bxl-github text-lg'></i>
                        </a>
                      )}
                      {repo.live_demo_url && (
                        <a href={repo.live_demo_url} target="_blank" className="text-mac-light-subtext hover:text-mac-systemBlue transition-colors" title="Live Demo">
                          <i className='bx bx-link-external text-lg'></i>
                        </a>
                      )}
                    </div>
                  </div>

                  <h3
                    className="font-semibold text-mac-light-text text-sm mb-1 truncate group-hover:text-mac-systemBlue transition-colors"
                    style={{ color: repo.title_color }}
                  >
                    {repo.title}
                  </h3>
                  <p
                    className="
                    text-xs text-mac-light-subtext 
                    line-clamp-3 
                    group-hover:line-clamp-6 
                    transition-all 
                    duration-300 
                    ease-out
                    mb-3 
                    leading-relaxed
                  "
                  >
                    {repo.description}
                  </p>


                  <div className="mt-auto flex gap-1 flex-wrap">
                    {repo.tags?.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="h-8 bg-mac-light-sidebar border-t border-mac-light-border flex items-center justify-between px-3 text-xs text-mac-light-subtext select-none">
          <div className="font-medium text-mac-light-text">{repos.length > 0 ? `${repos.length} items shown` : '0 items'}</div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1 rounded hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-mac-light-text transition-colors"
              >
                <i className='bx bx-chevron-left text-lg'></i>
              </button>
              <span className="text-mac-light-text">Page {page} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1 rounded hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-mac-light-text transition-colors"
              >
                <i className='bx bx-chevron-right text-lg'></i>
              </button>
            </div>
          )}
        </div>
      </MacWindow>
    </section>
  );
}