'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { Project, PaginatedResponse } from '@/types';
import { projectsService } from '@/services/projects.service';
import { useDebounce } from '@/hooks/useDebounce';
import { useCachedFetch } from '@/hooks/useCachedFetch';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import PaginationBar from '@/components/ui/pagination';
import SearchInput from '@/components/ui/search-input';
import { ProjectCardSkeleton } from '@/components/ui/skeleton';

interface ProjectGridProps {
  initialData: PaginatedResponse<Project>;
}

export default function ProjectGrid({ initialData }: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset to page 1 when search changes
  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setCurrentPage(1);
  }

  const limit = initialData.pagination.limit;

  // 1. Setup fetch function with useCallback
  const fetchProjects = useCallback(async () => {
    const response = await projectsService.getProjectsForUser({
      page: currentPage,
      limit,
      search: debouncedSearch || undefined,
    });
    return response.data;
  }, [currentPage, limit, debouncedSearch]);

  // 2. Use useCachedFetch with new positional arguments
  const { 
    data: fetchResult, 
    isLoading: isFetching, 
    isRefreshing 
  } = useCachedFetch(
    `projects_p${currentPage}_l${limit}_s${debouncedSearch}`,
    fetchProjects,
    { ttl: 1000 * 60 * 5 }
  );

  const projects = fetchResult?.data || (currentPage === 1 && !debouncedSearch ? initialData.data : []);
  const pagination = fetchResult?.pagination || (currentPage === 1 && !debouncedSearch ? initialData.pagination : { ...initialData.pagination, page: currentPage });
  
  // Final loading state logic
  const isLoading = (isFetching && !isRefreshing) && (mounted ? projects.length === 0 : initialData.data.length === 0);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);


  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.totalPages]);

  return (
    <>
      {/* Global Loading Pattern ("The Purple Bar") */}
      {(isFetching || isRefreshing) && (
        <div className="fixed top-0 left-0 right-0 z-[9999]">
          <div className="h-[2px] bg-indigo-500 animate-[loading_1.5s_infinite] origin-left"></div>
        </div>
      )}

      <div className="flex flex-col h-full apple-section-light">
        {/* Toolbar */}
        <div className="h-14 bg-[#f5f5f7] border-b border-black/10 flex items-center px-4 justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-[#86868b] text-sm bg-white px-3 py-1.5 rounded-md border border-black/5 shadow-sm">
            <i className='bx bxs-folder-open text-blue-500' />
            <span className="text-gray-300">/</span>
            <span className="font-medium text-[#1d1d1f]">projects</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-[#1d1d1f] apple-small">all</span>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects..."
          />
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 apple-section-light relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: pagination.limit }).map((_, idx) => (
                <ProjectCardSkeleton key={idx} />
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <i className='bx bxs-folder-open text-6xl mb-4 opacity-50' />
                <p>No projects found</p>
              </div>
            ) : (
              projects.map((project: Project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))
            )}
          </div>
        </div>

        {/* Status Bar */}
        <PaginationBar
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
