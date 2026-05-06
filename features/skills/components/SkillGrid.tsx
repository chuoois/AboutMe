'use client';

import { useState, useRef, useEffect } from 'react';
import type { Skill, PaginatedResponse } from '@/types';
import { skillsService } from '@/services/skills.service';
import { useDebounce } from '@/hooks/useDebounce';
import { useCachedFetch } from '@/hooks/useCachedFetch';
import SearchInput from '@/components/ui/search-input';
import { SkillGridSkeleton } from '@/components/ui/skeleton';

interface SkillGridProps {
  initialData: PaginatedResponse<Skill>;
}

export default function SkillGrid({ initialData }: SkillGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const limit = initialData.pagination.limit;

  const { data: fetchResult, loading, isRefreshing } = useCachedFetch({
    key: `skills_p1_l${limit}_s${debouncedSearch}`,
    fetcher: async () => {
      const response = await skillsService.getSkillsForUser({
        page: 1,
        limit,
        search: debouncedSearch || undefined,
      });
      return response.data;
    }
  });

  const skills = fetchResult?.data || (!debouncedSearch ? initialData.data : []);
  // Avoid skeleton on server/first-render if we have initialData to match SSR
  const isLoading = (loading && !isRefreshing) && (mounted ? skills.length === 0 : initialData.data.length === 0);

  // Group skills by category
  const grouped = skills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full apple-section-light">
      {/* Toolbar */}
      <div className="h-14 bg-[#f5f5f7] border-b border-black/10 flex items-center px-4 justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[#86868b] text-sm bg-white px-3 py-1.5 rounded-md border border-black/5 shadow-sm">
          <i className='bx bxs-grid-alt text-purple-600' />
          <span className="text-gray-300">/</span>
          <span className="font-medium text-[#1d1d1f] apple-small">Skills</span>
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search"
          accentColor="purple"
        />
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 apple-section-light relative select-none">
        {isLoading ? (
          <SkillGridSkeleton />
        ) : (
          <div className="space-y-10">
            {Object.keys(grouped).map((cat: string) => (
              <div key={cat} className="animate-mac-pop">
                <h3 className="apple-micro font-bold text-[#86868b] uppercase tracking-[0.2em] mb-6 border-b border-black/5 pb-2">
                  {cat}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
                  {grouped[cat].map((skill: Skill, idx: number) => (
                    <div
                      key={`${skill.id}-${idx}`}
                      className="group flex flex-col items-center gap-3 p-2 rounded-xl hover:bg-black/5 transition-all duration-200 cursor-pointer"
                    >
                      <div className="relative w-[68px] h-[68px] bg-white rounded-[18px] flex items-center justify-center 
                                      apple-shadow border border-black/5 
                                      group-hover:scale-110 group-hover:border-black/10 group-hover:shadow-purple-500/10 
                                      transition-all duration-300 ease-out">
                        <div className={`absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${skill.color?.replace('text-', 'bg-') || 'bg-white'}`} />
                        <i className={`bx ${skill.icon || 'bx-code'} text-4xl ${skill.color || 'text-[#1d1d1f]'} drop-shadow-sm`} />
                      </div>
                      <span className="apple-micro text-center text-[#1d1d1f] font-medium tracking-wide group-hover:text-purple-600 transition-colors">
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

      {/* Status Bar */}
      <div className="h-9 bg-[#f5f5f7] border-t border-black/10 flex items-center justify-between px-4 apple-micro shrink-0 select-none">
        <div className="flex items-center gap-2 text-[#86868b]">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span>{skills.length} applications installed</span>
        </div>
        <div className="flex items-center gap-4 text-[#86868b]">
          <span>Disk Usage: 450 MB</span>
          <div className="h-3 w-[1px] bg-black/10" />
          <span className="flex items-center gap-1">
            <i className='bx bxs-memory-card' /> RAM: 16GB
          </span>
        </div>
      </div>
    </div>
  );
}
