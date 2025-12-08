'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchData } from '@/lib/fetchdata';
import MacWindow from '@/components/macos/MacWindow';

type Skill = {
  id: number;
  category: string;
  skill_name: string;
  icon: string;
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const limit = 20;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const start = Date.now();
        const res = await fetchData(`/api/skills?page=${page}&limit=${limit}`);
        const data = res.data || [];
        const total = res.totalPages || Math.ceil((res.total || 50) / limit);

        // Giả lập delay nhỏ cho mượt
        const elapsed = Date.now() - start;
        if (elapsed < 300) await new Promise(r => setTimeout(r, 300 - elapsed));

        setSkills(data);
        setTotalPages(total);
      } catch (error) {
        console.error("Failed to load skills", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const grouped = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section className="w-full h-full flex items-center justify-center p-4">
      <MacWindow title="~/skills — -bash">
        
        {/* HEADER: TOOLBAR (Finder Style) */}
        <div className="h-12 bg-mac-light-sidebar border-b border-mac-light-border backdrop-blur-md flex items-center px-4 justify-between gap-4">
          <div className="flex items-center gap-2 text-mac-light-subtext text-sm">
            <i className='bx bx-folder'></i>
            <span className="font-medium text-mac-light-text">/ Skills</span>
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

        {/* CONTENT AREA: ICON VIEW */}
        <div ref={scrollRef} className="h-[500px] overflow-y-auto bg-white p-6 select-none">
          {loading ? (
            // Skeleton Loading (Light)
            <div className="grid grid-cols-4 md:grid-cols-5 gap-6 animate-pulse">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl border border-gray-200"></div>
                  <div className="w-16 h-2 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(grouped).map((cat) => (
                <div key={cat}>
                  {/* Category Label */}
                  <h3 className="text-xs font-bold text-mac-light-subtext uppercase tracking-widest mb-4 ml-2 border-b border-mac-light-border/50 pb-1">
                    {cat}
                  </h3>
                  
                  {/* Grid of Icons */}
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-4">
                    {grouped[cat].map((skill, idx) => (
                      <div 
                        key={`${skill.id}-${idx}`} 
                        className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-mac-systemBlue/10 transition-all cursor-default"
                      >
                        {/* Icon Container (Squircle shape like macOS App Icon) */}
                        <div className="w-14 h-14 bg-white rounded-[14px] flex items-center justify-center shadow-sm border border-gray-200 group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
                          <i className={`bx ${skill.icon} text-3xl text-gray-600 group-hover:text-mac-systemBlue transition-colors`}></i>
                        </div>
                        
                        {/* Skill Name */}
                        <span className="text-[11px] text-center text-mac-light-text font-medium px-2 py-0.5 rounded-full group-hover:text-mac-systemBlue truncate w-full max-w-[110px] leading-tight">
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

        {/* FOOTER: STATUS BAR */}
        <div className="h-8 bg-mac-light-sidebar border-t border-mac-light-border flex items-center justify-between px-3 text-xs text-mac-light-subtext select-none">
          <div className="flex items-center gap-2">
            <i className='bx bx-check-circle text-green-500'></i>
            <span className="text-mac-light-text">{skills.length} modules loaded</span>
          </div>

          <div className="flex items-center gap-2">
            {page > 1 && (
              <button onClick={() => handlePageChange(page - 1)} className="hover:text-mac-light-text hover:bg-black/5 p-1 rounded transition-colors">
                <i className='bx bx-chevron-left text-lg'></i>
              </button>
            )}
            
            <span>Memory Usage: Low</span>
            
            {page < totalPages && (
              <button onClick={() => handlePageChange(page + 1)} className="hover:text-mac-light-text hover:bg-black/5 p-1 rounded transition-colors">
                <i className='bx bx-chevron-right text-lg'></i>
              </button>
            )}
          </div>
        </div>
      </MacWindow>
    </section>
  );
}