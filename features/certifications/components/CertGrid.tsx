'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { Cert, PaginatedResponse } from '@/types';
import { certificationService } from '@/services/certification.service';
import { useDebounce } from '@/hooks/useDebounce';
import { useCachedFetch } from '@/hooks/useCachedFetch';
import { formatDate } from '@/lib/helpers/date';
import SearchInput from '@/components/ui/search-input';
import PaginationBar from '@/components/ui/pagination';
import CertDetailModal from './CertDetailModal';
import { CertCardSkeleton } from '@/components/ui/skeleton';

interface CertGridProps {
  initialData: PaginatedResponse<Cert>;
}

export default function CertGrid({ initialData }: CertGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setCurrentPage(1);
  }

  const limit = initialData.pagination.limit;

  const fetchCerts = useCallback(async () => {
    const response = await certificationService.getCertificatesForUser({
      page: currentPage,
      limit,
      search: debouncedSearch || undefined,
    });
    return response.data;
  }, [currentPage, limit, debouncedSearch]);

  const { data: fetchResult, isLoading: isFetching, isRefreshing } = useCachedFetch(
    `certs_p${currentPage}_l${limit}_s${debouncedSearch}`,
    fetchCerts,
    { ttl: 1000 * 60 * 5 }
  );

  const certs = fetchResult?.data || (currentPage === 1 && !debouncedSearch ? initialData.data : []);
  const pagination = fetchResult?.pagination || (currentPage === 1 && !debouncedSearch ? initialData.pagination : { ...initialData.pagination, page: currentPage });
  // Avoid skeleton on server/first-render if we have initialData to match SSR
  const isLoading = (isFetching && !isRefreshing) && (mounted ? certs.length === 0 : initialData.data.length === 0);


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
            <i className='bx bxs-certification text-yellow-500' />
            <span className="text-gray-300">/</span>
            <span className="font-medium text-[#1d1d1f] apple-small">certificates</span>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search certificate..."
            accentColor="yellow"
          />
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 apple-section-light relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: pagination.limit }).map((_, idx) => (
                <CertCardSkeleton key={idx} />
              ))
            ) : certs.length === 0 ? (
              <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-500 mt-20">
                <i className='bx bx-certification text-6xl mb-3 opacity-50' />
                <p>No Certificates Found</p>
              </div>
            ) : (
              certs.map((cert: Cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="group cursor-pointer bg-white border border-black/5 hover:border-yellow-500/30 hover:bg-[#f9f9fb] 
                             rounded-xl p-5 transition-all duration-300 flex flex-col h-full hover:apple-shadow hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-[#f5f5f7] border border-black/5 group-hover:scale-110 transition-transform duration-300">
                      <i className={`bx ${cert.icon || 'bxs-certification'} text-3xl ${cert.color || 'text-yellow-500'}`} />
                    </div>
                    {cert.credential_url && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <i className='bx bx-link-external text-xl text-gray-500' />
                      </div>
                    )}
                  </div>

                  <h3 className="apple-body font-bold text-[#1d1d1f] mb-1 leading-snug group-hover:text-yellow-500 transition-colors line-clamp-2">
                    {cert.coursera_name}
                  </h3>
                  <p className="apple-small text-[#86868b] mb-4 font-medium flex items-center gap-1.5">
                    <i className='bx bxs-institution text-gray-400' /> {cert.issuer}
                  </p>
                  <p className="apple-small text-[#86868b] line-clamp-2 leading-relaxed mb-4">
                    {cert.description}
                  </p>

                  <div className="mt-auto flex gap-2 flex-wrap">
                    <span className="apple-micro px-2.5 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-black/5 font-mono">
                      {formatDate(cert.issue_date)}
                    </span>
                    {cert.specialization && (
                      <span className="apple-micro px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium truncate max-w-[140px]">
                        {cert.specialization}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Bar */}
        <PaginationBar
          pagination={pagination}
          onPageChange={handlePageChange}
          itemLabel={pagination.total > 0 ? 'verified credentials' : 'items'}
        />
      </div>

      {/* Modal */}
      <CertDetailModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </>
  );
}
