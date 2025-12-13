'use client';

import { useEffect, useState, useRef } from 'react';
import MacWindow from '@/components/macos-components/MacWindow';
import { projectsService } from "@/services/projects.service";
import { useDebounce } from "@/hooks/useDebounce";

// --- TYPE DEFINITIONS ---
type Repo = {
  id: number;
  title: string;
  icon: string | null;
  description: string;
  tags: string[];
  live_demo_url?: string | null;
  git_url?: string | null;
  color?: string;
  created_at?: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      try {
        const response = await projectsService.getProjectsforUser({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearchQuery || undefined,
        });

        const result = response.data;

        setRepos(result.data || []);

        if (result.pagination) {
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [pagination.page, pagination.limit, debouncedSearchQuery]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
        <MacWindow
          title="~/projects — Finder"
          className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
        >
          <div className="flex flex-col h-full bg-[#1e1e1e] text-white">

            {/* --- TOOLBAR --- */}
            <div className="h-14 bg-[#252525] border-b border-white/10 flex items-center px-4 justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
                <i className='bx bxs-folder-open text-blue-400'></i>
                <span className="text-gray-500">/</span>
                <span className="font-medium text-gray-200">projects</span>
                <span className="text-gray-500">/</span>
                <span className="font-medium text-white">all</span>
              </div>

              <div className="relative w-48 md:w-64">
                <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-200 
                             placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-[#1e1e1e] relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                  Array.from({ length: pagination.limit }).map((_, idx) => (
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
                ) : repos.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                    <i className='bx bxs-folder-open text-6xl mb-4 opacity-50'></i>
                    <p>No projects found</p>
                  </div>
                ) : (
                  repos.map(repo => (
                    <div
                      key={repo.id}
                      onClick={() => setSelectedRepo(repo)}
                      className="group relative bg-[#252525] border border-white/5 hover:border-blue-500/30 hover:bg-[#2a2a2a] 
                                 rounded-xl p-5 transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-[#1e1e1e] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                          <i className={`bx ${repo.icon || 'bx-code-alt'} text-3xl ${repo.color || 'text-gray-400'}`}></i>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
                          {repo.git_url && (
                            <a href={repo.git_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                              className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" title="Source Code">
                              <i className='bx bxl-github text-xl'></i>
                            </a>
                          )}
                          {repo.live_demo_url && (
                            <a href={repo.live_demo_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                              className="p-2 hover:bg-blue-500/20 rounded-full text-gray-400 hover:text-blue-400 transition-colors" title="Live Demo">
                              <i className='bx bx-link-external text-xl'></i>
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-100 text-base mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {repo.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
                        {repo.description}
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        {repo.tags?.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2.5 py-1 rounded-full bg-[#1e1e1e] text-gray-400 border border-white/5 font-medium tracking-wide"
                          >
                            {t}
                          </span>
                        ))}
                        {repo.tags && repo.tags.length > 3 && (
                          <span className="text-[10px] px-2 py-1 text-gray-600">+{repo.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* --- STATUS BAR --- */}
            <div className="h-9 bg-[#252525] border-t border-white/10 flex items-center justify-between px-4 text-xs select-none shrink-0">
              <div className="text-gray-500 font-mono">
                {pagination.total} items <span className="text-gray-700">|</span> {pagination.limit} per page
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                    >
                      <i className='bx bx-chevron-left text-lg'></i>
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                    >
                      <i className='bx bx-chevron-right text-lg'></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </MacWindow>
      </section>

      {/* --- MODAL CHI TIẾT PROJECT --- */}
      {selectedRepo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" 
          onClick={() => setSelectedRepo(null)}
        >
          <div 
            className="w-full max-w-3xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <MacWindow
              title={selectedRepo.title}
              className="dark shadow-2xl"
              // Đã bỏ prop onClose để tránh lỗi compile
            >
              <div className="bg-[#1e1e1e] text-white min-h-[500px] max-h-[85vh] overflow-y-auto">
                <div className="p-8">
                  {/* Header với icon lớn */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="p-6 rounded-2xl bg-[#252525] border border-white/10 shadow-xl flex-shrink-0">
                      <i className={`bx ${selectedRepo.icon || 'bx-code-alt'} text-6xl ${selectedRepo.color || 'text-gray-400'}`}></i>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-4">{selectedRepo.title}</h2>
                      <div className="flex flex-wrap gap-3">
                        {selectedRepo.git_url && (
                          <a 
                            href={selectedRepo.git_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-[#252525] rounded-xl hover:bg-white/10 transition-all font-medium border border-white/10"
                          >
                            <i className='bx bxl-github text-xl'></i>
                            Source Code
                          </a>
                        )}
                        {selectedRepo.live_demo_url && (
                          <a 
                            href={selectedRepo.live_demo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-all text-blue-400 font-medium border border-blue-500/30"
                          >
                            <i className='bx bx-link-external text-xl'></i>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Description</h3>
                    <p className="text-gray-400 leading-relaxed text-base whitespace-pre-wrap">
                      {selectedRepo.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedRepo.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-full bg-[#252525] text-gray-300 border border-white/10 font-medium text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </MacWindow>
          </div>
        </div>
      )}
    </>
  );
}