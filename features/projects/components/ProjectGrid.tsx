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

  const { data: fetchResult, loading, isRefreshing } = useCachedFetch({
    key: `projects_p${currentPage}_l${limit}_s${debouncedSearch}`,
    fetcher: async () => {
      const response = await projectsService.getProjectsForUser({
        page: currentPage,
        limit,
        search: debouncedSearch || undefined,
      });
      return response.data;
    }
  });

  const projects = fetchResult?.data || (currentPage === 1 && !debouncedSearch ? initialData.data : []);
  const pagination = fetchResult?.pagination || (currentPage === 1 && !debouncedSearch ? initialData.pagination : { ...initialData.pagination, page: currentPage });
  // Avoid skeleton on server/first-render if we have initialData to match SSR
  const isLoading = (loading && !isRefreshing) && (mounted ? projects.length === 0 : initialData.data.length === 0);

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
      <div className="flex flex-col h-full apple-section-dark">
        {/* Toolbar */}
        <div className="h-14 bg-black border-b border-white/10 flex items-center px-4 justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#1c1c1e] px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
            <i className='bx bxs-folder-open text-blue-400' />
            <span className="text-gray-500">/</span>
            <span className="font-medium text-gray-200">projects</span>
            <span className="text-gray-500">/</span>
            <span className="font-medium text-white apple-small">all</span>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects..."
          />
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 apple-section-dark relative">
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
