import { ProjectCardSkeleton } from '@/components/ui/skeleton';

export default function ProjectsLoading() {
  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className="dark max-w-5xl w-full h-[85vh] md:h-[650px] rounded-mac-window bg-mac-dark-window/90 backdrop-blur-mac border border-mac-dark-border shadow-mac-window-dark flex flex-col overflow-hidden">
        {/* Fake toolbar */}
        <div className="h-14 bg-[#252525] border-b border-white/10 shrink-0" />
        {/* Skeleton grid */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="h-9 bg-[#252525] border-t border-white/10 shrink-0" />
      </div>
    </section>
  );
}
