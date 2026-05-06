import { Suspense } from 'react';
import MacWindow from '@/components/layout/MacWindow';
import { getProjectsForUser } from '@/features/projects/services/projects.server';
import ProjectGrid from '@/features/projects/components/ProjectGrid';
import { ProjectCardSkeleton } from '@/components/ui/skeleton';

// Force dynamic rendering — API data not available at build time
export const dynamic = 'force-dynamic';

/**
 * PROJECTS PAGE — Server Component with async data fetching.
 * 
 * PERFORMANCE: Data is fetched on the server at request time (with 60s ISR cache).
 * The ProjectGrid client component receives pre-fetched data as props,
 * so users see content immediately without a loading skeleton flash.
 * 
 * Client-side search/pagination then takes over for interactive use.
 */
export default async function ProjectsPage() {
  const initialData = await getProjectsForUser({ page: 1, limit: 6 });

  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <MacWindow
        title="~/projects — Finder"
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <Suspense fallback={
          <div className="flex flex-col h-full bg-[#1e1e1e] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          </div>
        }>
          <ProjectGrid initialData={initialData} />
        </Suspense>
      </MacWindow>
    </section>
  );
}
