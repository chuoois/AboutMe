// components/ui/skeleton.tsx
export function ProjectCardSkeleton() {
  return (
    <div className="bg-[#252525] border border-white/5 rounded-xl p-5 h-48 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-lg" />
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-white/5 rounded-full" />
        </div>
      </div>
      <div className="w-3/4 h-5 bg-white/10 rounded mb-3" />
      <div className="w-full h-10 bg-white/5 rounded mb-4" />
      <div className="flex gap-2">
        <div className="w-16 h-5 bg-white/5 rounded-full" />
        <div className="w-16 h-5 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

export function CertCardSkeleton() {
  return (
    <div className="bg-[#252525] border border-white/5 rounded-xl p-5 h-52 animate-pulse">
      <div className="w-12 h-12 bg-white/10 rounded-lg mb-4" />
      <div className="w-3/4 h-5 bg-white/10 rounded mb-3" />
      <div className="w-1/2 h-4 bg-white/5 rounded mb-6" />
      <div className="flex gap-2 mt-auto">
        <div className="w-16 h-5 bg-white/5 rounded-full" />
        <div className="w-20 h-5 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

export function SkillGridSkeleton() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-8 animate-pulse">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-[#252525] rounded-[18px] border border-white/5" />
          <div className="w-12 h-2 bg-[#252525] rounded" />
        </div>
      ))}
    </div>
  );
}
