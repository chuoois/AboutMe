'use client';

import { useEffect, useState, useRef } from 'react';
import MacWindow from '@/components/macos-components/MacWindow';

// --- TYPE DEFINITIONS ---
type Skill = {
  id: number;
  category: string;
  skill_name: string;
  icon: string;
  color?: string; // Màu riêng cho từng icon
};

// --- MOCK DATA (HARD CODED) ---
const MOCK_SKILLS: Skill[] = [
  // Frontend
  { id: 1, category: "Frontend", skill_name: "React.js", icon: "bxl-react", color: "text-blue-400" },
  { id: 2, category: "Frontend", skill_name: "Next.js", icon: "bxl-gmail", color: "text-white" }, // Dùng tạm icon gmail làm nextjs hoặc icon khác nếu có
  { id: 3, category: "Frontend", skill_name: "TypeScript", icon: "bxl-typescript", color: "text-blue-500" },
  { id: 4, category: "Frontend", skill_name: "Tailwind", icon: "bxl-tailwind-css", color: "text-cyan-400" },
  { id: 5, category: "Frontend", skill_name: "Vue.js", icon: "bxl-vuejs", color: "text-green-400" },
  
  // Backend
  { id: 6, category: "Backend", skill_name: "Node.js", icon: "bxl-nodejs", color: "text-green-500" },
  { id: 7, category: "Backend", skill_name: "NestJS", icon: "bxs-component", color: "text-red-500" },
  { id: 8, category: "Backend", skill_name: "Python", icon: "bxl-python", color: "text-yellow-300" },
  { id: 9, category: "Backend", skill_name: "GoLang", icon: "bxl-go-lang", color: "text-cyan-300" },

  // Database
  { id: 10, category: "Database", skill_name: "PostgreSQL", icon: "bxs-data", color: "text-blue-300" },
  { id: 11, category: "Database", skill_name: "MongoDB", icon: "bxl-mongodb", color: "text-green-400" },
  { id: 12, category: "Database", skill_name: "Redis", icon: "bxs-hdd", color: "text-red-400" },

  // DevOps & Tools
  { id: 13, category: "DevOps", skill_name: "Docker", icon: "bxl-docker", color: "text-blue-400" },
  { id: 14, category: "DevOps", skill_name: "AWS", icon: "bxl-aws", color: "text-orange-400" },
  { id: 15, category: "DevOps", skill_name: "Git", icon: "bxl-git", color: "text-orange-500" },
  { id: 16, category: "DevOps", skill_name: "Figma", icon: "bxl-figma", color: "text-purple-400" },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const limit = 50; // Load all hoặc limit lớn để show dạng Launchpad
  const totalPages = Math.ceil(MOCK_SKILLS.length / limit);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Giả lập delay
      await new Promise(r => setTimeout(r, 500));
      
      const start = (page - 1) * limit;
      const end = start + limit;
      setSkills(MOCK_SKILLS.slice(start, end));
      setLoading(false);
    };
    load();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Group skills by category
  const grouped = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      {/* Container: Dark Mode, Shadow đậm */}
      <MacWindow 
        title="~/skills — Launchpad" 
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
          
          {/* --- TOOLBAR (Finder Style) --- */}
          <div className="h-14 bg-[#252525] border-b border-white/10 flex items-center px-4 justify-between gap-4 shrink-0">
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
              <i className='bx bxs-grid-alt text-purple-400'></i>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-white">Skills</span>
            </div>

            {/* Search Input */}
            <div className="relative w-48 md:w-64">
              <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'></i>
              <input
                disabled
                placeholder="Search"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-200 
                           placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* --- CONTENT AREA: LAUNCHPAD GRID --- */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 bg-[#1e1e1e] relative select-none">
            {loading ? (
              // --- SKELETON LOADING ---
              <div className="grid grid-cols-4 md:grid-cols-6 gap-8 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-[#252525] rounded-[18px] border border-white/5"></div>
                    <div className="w-12 h-2 bg-[#252525] rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              // --- REAL DATA ---
              <div className="space-y-10">
                {Object.keys(grouped).map((cat) => (
                  <div key={cat} className="animate-mac-pop">
                    {/* Category Title */}
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">
                      {cat}
                    </h3>
                    
                    {/* Grid Icons */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
                      {grouped[cat].map((skill, idx) => (
                        <div 
                          key={`${skill.id}-${idx}`} 
                          className="group flex flex-col items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer"
                        >
                          {/* Icon Container (Squircle) */}
                          <div className="relative w-[68px] h-[68px] bg-[#2a2a2a] rounded-[18px] flex items-center justify-center 
                                          shadow-lg shadow-black/20 border border-white/5 
                                          group-hover:scale-110 group-hover:border-white/20 group-hover:shadow-purple-500/10 
                                          transition-all duration-300 ease-out">
                            {/* Glow Effect behind icon */}
                            <div className={`absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${skill.color?.replace('text-', 'bg-') || 'bg-white'}`}></div>
                            
                            <i className={`bx ${skill.icon} text-4xl ${skill.color || 'text-gray-400'} drop-shadow-md`}></i>
                          </div>
                          
                          {/* Skill Name */}
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
                 <i className='bx bxs-memory-card' ></i> RAM: 16GB
               </span>
            </div>
          </div>

        </div>
      </MacWindow>
    </section>
  );
}