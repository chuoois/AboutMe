import { Suspense } from 'react';
import MacWindow from '@/components/layout/MacWindow';
import { getCertificatesForUser } from '@/features/certifications/services/certification.server';
import CertGrid from '@/features/certifications/components/CertGrid';

export const dynamic = 'force-dynamic';
import { CertCardSkeleton } from '@/components/ui/skeleton';

/**
 * CERTIFICATION PAGE — Server Component with server-side data fetching.
 */
export default async function CertificationPage() {
  const initialData = await getCertificatesForUser({ page: 1, limit: 6 });

  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <MacWindow
        title="~/certificates — -bash"
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <Suspense fallback={
          <div className="flex flex-col h-full bg-[#1e1e1e] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CertCardSkeleton key={i} />)}
            </div>
          </div>
        }>
          <CertGrid initialData={initialData} />
        </Suspense>
      </MacWindow>
    </section>
  );
}
