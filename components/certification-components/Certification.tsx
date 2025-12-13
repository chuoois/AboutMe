'use client';

import { useEffect, useState, useRef } from 'react';
import MacWindow from '@/components/macos-components/MacWindow';
import { certificationService } from "@/services/certification.service";
import { useDebounce } from "@/hooks/useDebounce";

// --- TYPE DEFINITIONS ---
type Cert = {
  id: number;
  coursera_name: string;
  specialization?: string | null;
  icon: string | null;
  color: string | null;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  description: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// --- HELPER FORMAT DATE ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

export default function Certification() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Modal state
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await certificationService.getCertificatesforUser({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearchQuery || undefined,
        });

        const result = response.data;

        setCerts(result.data || []);

        if (result.pagination) {
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Error loading certifications:", error);
        setCerts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [pagination.page, pagination.limit, debouncedSearchQuery]);

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openModal = (cert: Cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCert(null);
  };

  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <MacWindow 
        title="~/certificates — -bash" 
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white">

          {/* --- HEADER: TOOLBAR --- */}
          <div className="h-14 bg-[#252525] border-b border-white/10 flex items-center px-4 justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
              <i className='bx bxs-certification text-yellow-500'></i>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-white">certificates</span>
            </div>

            <div className="relative w-48 md:w-64">
              <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certificate..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-200 
                           placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition-all"
              />
            </div>
          </div>

          {/* --- CONTENT AREA: GRID LAYOUT --- */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-[#1e1e1e] relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {loading ? (
                Array.from({ length: pagination.limit }).map((_, idx) => (
                  <div key={idx} className="bg-[#252525] border border-white/5 rounded-xl p-5 h-52 animate-pulse">
                    <div className="w-12 h-12 bg-white/10 rounded-lg mb-4"></div>
                    <div className="w-3/4 h-5 bg-white/10 rounded mb-3"></div>
                    <div className="w-1/2 h-4 bg-white/5 rounded mb-6"></div>
                    <div className="flex gap-2 mt-auto">
                      <div className="w-16 h-5 bg-white/5 rounded-full"></div>
                      <div className="w-20 h-5 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                ))
              ) : certs.length === 0 ? (
                <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-500 mt-20">
                  <i className='bx bx-certification text-6xl mb-3 opacity-50'></i>
                  <p>No Certificates Found</p>
                </div>
              ) : (
                certs.map(cert => (
                  <div 
                    key={cert.id} 
                    onClick={() => openModal(cert)}
                    className="group cursor-pointer bg-[#252525] border border-white/5 hover:border-yellow-500/30 hover:bg-[#2a2a2a] 
                               rounded-xl p-5 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-[#1e1e1e] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        <i className={`bx ${cert.icon || 'bxs-certification'} text-3xl ${cert.color || 'text-yellow-500'}`}></i>
                      </div>
                      {cert.credential_url && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <i className='bx bx-link-external text-xl text-gray-500'></i>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-100 text-[15px] mb-1 leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2">
                      {cert.coursera_name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 font-medium flex items-center gap-1.5">
                      <i className='bx bxs-institution text-gray-600'></i> {cert.issuer}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    <div className="mt-auto flex gap-2 flex-wrap">
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#1e1e1e] text-gray-400 border border-white/5 font-mono">
                        {formatDate(cert.issue_date)}
                      </span>
                      
                      {cert.specialization && (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium truncate max-w-[140px]">
                          {cert.specialization}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --- FOOTER: STATUS BAR --- */}
          <div className="h-9 bg-[#252525] border-t border-white/10 flex items-center justify-between px-4 text-xs select-none shrink-0">
            <div className="text-gray-500 font-mono">
              {pagination.total > 0 ? `${pagination.total} verified credentials` : '0 items'}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)} 
                    disabled={pagination.page === 1} 
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                  >
                    <i className='bx bx-chevron-left text-lg'></i>
                  </button>
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)} 
                    disabled={pagination.page === pagination.totalPages} 
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                  >
                    <i className='bx bx-chevron-right text-lg'></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </MacWindow>

      {/* --- MODAL CHI TIẾT --- */}
      {isModalOpen && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={closeModal}>
          <div 
            className="bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#252525] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                <i className={`bx ${selectedCert.icon || 'bxs-certification'} text-2xl ${selectedCert.color || 'text-yellow-500'}`}></i>
                {selectedCert.coursera_name}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className='bx bx-x text-2xl'></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issuer</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <i className='bx bxs-institution'></i>
                    {selectedCert.issuer}
                  </p>
                </div>

                {selectedCert.specialization && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Specialization</p>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
                      {selectedCert.specialization}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-400 mb-1">Issued Date</p>
                  <p className="text-white font-mono">{formatDate(selectedCert.issue_date)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Description</p>
                  <p className="text-gray-300 leading-relaxed">{selectedCert.description}</p>
                </div>

                {selectedCert.credential_url && (
                  <div className="pt-4">
                    <a 
                      href={selectedCert.credential_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-4 py-2.5 rounded-lg border border-yellow-500/30 transition-all font-medium"
                    >
                      <i className='bx bx-link-external'></i>
                      View Credential
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}