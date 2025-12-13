'use client';

import { useEffect, useState, useRef } from 'react';
import MacWindow from '@/components/macos-components/MacWindow';
import { skillsService } from "@/services/skills.service";
import { useDebounce } from "@/hooks/useDebounce";

// --- TYPE DEFINITIONS ---
type Skill = {
  id: number;
  category: string;
  skill_name: string;
  icon: string | null;
  color?: string;
  created_at: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50, // Load nhiều để giống Launchpad
    total: 0,
    totalPages: 1,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await skillsService.getSkillsforUser({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearchQuery || undefined,
        });

        const result = response.data;

        setSkills(result.data || []);

        if (result.pagination) {
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Error loading skills:", error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [pagination.page, pagination.limit, debouncedSearchQuery]);

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery]);

  // Group skills by category
  const grouped = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <MacWindow
        title="~/skills — Launchpad"
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white">

          {/* --- TOOLBAR --- */}
          <div className="h-14 bg-[#252525] border-b border-white/10 flex items-center px-4 justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
              <i className='bx bxs-grid-alt text-purple-400'></i>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-white">Skills</span>
            </div>

            {/* Search Input - Bật để search hoạt động */}
            <div className="relative w-48 md:w-64">
              <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-200 
                           placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              />
            </div>
          </div>

          {/* --- CONTENT AREA --- */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 bg-[#1e1e1e] relative select-none">
            {loading ? (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-8 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-[#252525] rounded-[18px] border border-white/5"></div>
                    <div className="w-12 h-2 bg-[#252525] rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-10">
                {Object.keys(grouped).map((cat) => (
                  <div key={cat} className="animate-mac-pop">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">
                      {cat}
                    </h3>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
                      {grouped[cat].map((skill, idx) => (
                        <div
                          key={`${skill.id}-${idx}`}
                          className="group flex flex-col items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer"
                        >
                          <div className="relative w-[68px] h-[68px] bg-[#2a2a2a] rounded-[18px] flex items-center justify-center 
                                          shadow-lg shadow-black/20 border border-white/5 
                                          group-hover:scale-110 group-hover:border-white/20 group-hover:shadow-purple-500/10 
                                          transition-all duration-300 ease-out">
                            <div className={`absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${skill.color?.replace('text-', 'bg-') || 'bg-white'}`}></div>

                            <i className={`bx ${skill.icon || 'bx-code'} text-4xl ${skill.color || 'text-gray-400'} drop-shadow-md`}></i>
                          </div>

                          <span className="text-[12px] text-center text-gray-300 font-medium tracking-wide group-hover:text-white transition-colors">
                            {skill.skill_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- STATUS BAR --- */}
          <div className="h-9 bg-[#252525] border-t border-white/10 flex items-center justify-between px-4 text-xs shrink-0 select-none">
            <div className="flex items-center gap-2 text-gray-400">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span>{skills.length} applications installed</span>
            </div>

            <div className="flex items-center gap-4 text-gray-500">
              <span>Disk Usage: 450 MB</span>
              <div className="h-3 w-[1px] bg-white/10"></div>
              <span className="flex items-center gap-1">
                <i className='bx bxs-memory-card'></i> RAM: 16GB
              </span>
            </div>
          </div>

        </div>
      </MacWindow>
    </section>
  );
}