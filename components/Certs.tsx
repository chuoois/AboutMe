'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchData } from '@/lib/fetchdata';
import { formatMonthYear } from '@/lib/format';
import MacWindow from '@/components/macos/MacWindow';

type Cert = {
  id: number;
  coursera_name: string;
  specialization: string;
  icon: string;
  iconColor: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  description: string;
  created_at: string;
};

export default function Certs() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const limit = 6;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const start = Date.now();
        const res = await fetchData(`/api/coursera-certificates?page=${page}&limit=${limit}`);
        const data = res.data || (Array.isArray(res) ? res : []);
        const total = res.totalPages || res.total || 1;

        const elapsed = Date.now() - start;
        if (elapsed < 300) await new Promise(r => setTimeout(r, 300 - elapsed));

        setCerts(data);
        setTotalPages(total);
      } catch (err) {
        console.error("Failed to fetch certs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full h-full flex items-center justify-center p-4">
      {/* Title: Cập nhật style để text title dark mode (nếu MacWindow chưa xử lý) */}
      <MacWindow title="~/certificates — -bash">
        
        {/* HEADER: TOOLBAR (Giống Finder Toolbar) */}
        <div className="h-12 bg-mac-light-sidebar border-b border-mac-light-border backdrop-blur-md flex items-center px-4 justify-between gap-4">
          <div className="flex items-center gap-2 text-mac-light-subtext text-sm">
            <i className='bx bx-certification'></i>
            <span className="font-medium text-mac-light-text">/ certificates</span>
          </div>

          <div className="relative flex-1 max-w-xs">
            <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-mac-light-subtext text-sm'></i>
            <input
              disabled
              placeholder="Search certificate..."
              className="w-full bg-white border border-mac-light-border shadow-sm rounded-md py-1.5 pl-9 pr-3 text-xs text-mac-light-text focus:outline-none focus:ring-2 focus:ring-mac-systemBlue/20 focus:border-mac-systemBlue placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>

        {/* CONTENT AREA: GRID LAYOUT */}
        {/* Nền trắng chuẩn Finder */}
        <div ref={scrollRef} className="h-[500px] overflow-y-auto bg-white p-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Loading Skeleton (Light Mode)
              Array.from({ length: limit }).map((_, idx) => (
                <div key={idx} className="bg-gray-100 border border-gray-200 rounded-lg p-4 h-48 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded mb-4"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : certs.length === 0 ? (
              // Empty State (Light Mode)
              <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-400 mt-20">
                <i className='bx bx-certification text-6xl mb-2 text-gray-300'></i>
                <p>No Certificates Found</p>
              </div>
            ) : (
              // Card Item (Light Mode)
              certs.map(cert => (
                <div 
                  key={cert.id} 
                  className="group bg-white border border-mac-light-border shadow-mac-btn hover:bg-mac-systemBlue/5 hover:border-mac-systemBlue/30 rounded-lg p-4 transition-all duration-200 flex flex-col cursor-default h-48"
                >
                  {/* Card Header: Icon & Link */}
                  <div className="flex items-start justify-between mb-3">
                    <i 
                      className={`bx ${cert.icon || "bx-award"} text-4xl drop-shadow-sm group-hover:scale-110 transition-transform`}
                      style={{ color: cert.iconColor || '#007AFF' }} 
                    ></i>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {cert.credential_url && (
                        <a href={cert.credential_url} target="_blank" className="text-mac-light-subtext hover:text-mac-systemBlue transition-colors" title="View Credential">
                          <i className='bx bx-link-external text-lg'></i>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card Body: Title & Issuer */}
                  <h3 className="font-semibold text-mac-light-text text-sm mb-1 truncate group-hover:text-mac-systemBlue" title={cert.coursera_name}>
                    {cert.coursera_name}
                  </h3>
                  <p className="text-xs text-mac-light-subtext mb-3 line-clamp-2 leading-relaxed">
                    {cert.issuer} • {cert.description || 'No description'}
                  </p>

                  {/* Card Footer: Tags (Date & Specialization) */}
                  <div className="mt-auto flex gap-1 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 whitespace-nowrap font-medium">
                      {formatMonthYear(cert.issue_date)}
                    </span>
                    {cert.specialization && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 truncate max-w-[120px]" title={cert.specialization}>
                        {cert.specialization}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* STATUS BAR (Pagination) */}
        <div className="h-8 bg-mac-light-sidebar border-t border-mac-light-border flex items-center justify-between px-3 text-xs text-mac-light-subtext select-none">
          <div className="font-medium text-mac-light-text">{certs.length > 0 ? `${certs.length} items shown` : '0 items'}</div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1} 
                className="p-1 rounded hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-mac-light-text transition-colors"
              >
                <i className='bx bx-chevron-left text-lg'></i>
              </button>
              <span className="text-mac-light-text">Page {page} of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages} 
                className="p-1 rounded hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent text-mac-light-text transition-colors"
              >
                <i className='bx bx-chevron-right text-lg'></i>
              </button>
            </div>
          )}
        </div>
      </MacWindow>
    </section>
  );
}