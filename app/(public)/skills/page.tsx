import { Suspense } from 'react';
import MacWindow from '@/components/layout/MacWindow';
import { getSkillsForUser } from '@/features/skills/services/skills.server';
import SkillGrid from '@/features/skills/components/SkillGrid';

export const dynamic = 'force-dynamic';
import { SkillGridSkeleton } from '@/components/ui/skeleton';

/**
 * SKILLS PAGE — Server Component with server-side data fetching.
 */
export default async function SkillsPage() {
  const initialData = await getSkillsForUser({ page: 1, limit: 50 });

  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <MacWindow
        title="~/skills — Launchpad"
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <Suspense fallback={
          <div className="flex flex-col h-full bg-[#1e1e1e] p-8">
            <SkillGridSkeleton />
          </div>
        }>
          <SkillGrid initialData={initialData} />
        </Suspense>
      </MacWindow>
    </section>
  );
}
