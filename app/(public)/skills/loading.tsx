import { SkillGridSkeleton } from '@/components/ui/skeleton';

export default function SkillsLoading() {
  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className="dark max-w-5xl w-full h-[85vh] md:h-[650px] rounded-mac-window bg-mac-dark-window/90 backdrop-blur-mac border border-mac-dark-border shadow-mac-window-dark flex flex-col overflow-hidden">
        <div className="h-14 bg-[#252525] border-b border-white/10 shrink-0" />
        <div className="flex-1 p-8">
          <SkillGridSkeleton />
        </div>
        <div className="h-9 bg-[#252525] border-t border-white/10 shrink-0" />
      </div>
    </section>
  );
}
