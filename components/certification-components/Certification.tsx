'use client';

import { useEffect, useState, useRef } from 'react';
import MacWindow from '@/components/macos-components/MacWindow';

// --- TYPE DEFINITIONS ---
type Cert = {
  id: number;
  coursera_name: string;
  specialization?: string;
  icon: string;
  color: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  description: string;
};

// --- HELPER FORMAT DATE ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

// --- MOCK DATA (HARD CODED) ---
const MOCK_CERTS: Cert[] = [
  {
    id: 1,
    coursera_name: "Google IT Support Professional Certificate",
    specialization: "IT Infrastructure",
    icon: "bxl-google",
    color: "text-blue-500",
    issuer: "Google",
    issue_date: "2023-10-15",
    credential_url: "#",
    description: "Troubleshooting, customer service, networking, operating systems, system administration, and security."
  },
  {
    id: 2,
    coursera_name: "Meta Front-End Developer Professional Certificate",
    specialization: "Web Development",
    icon: "bxl-meta", // Hoặc bxl-facebook nếu icon meta không có
    color: "text-blue-400",
    issuer: "Meta",
    issue_date: "2023-12-20",
    credential_url: "#",
    description: "Advanced React, UI/UX principles, JavaScript deep dive, and frontend portfolio building."
  },
  {
    id: 3,
    coursera_name: "AWS Certified Cloud Practitioner",
    specialization: "Cloud Computing",
    icon: "bxl-aws",
    color: "text-orange-500",
    issuer: "Amazon Web Services",
    issue_date: "2024-01-10",
    credential_url: "#",
    description: "Overall understanding of the AWS Cloud platform, basic security and compliance aspects."
  },
  {
    id: 4,
    coursera_name: "CS50: Introduction to Computer Science",
    specialization: "Computer Science",
    icon: "bxs-graduation",
    color: "text-red-500",
    issuer: "Harvard University",
    issue_date: "2022-05-01",
    credential_url: "#",
    description: "An entry-level course teaching students how to think algorithmically and solve problems efficiently."
  },
  {
    id: 5,
    coursera_name: "Legacy Full Stack JavaScript",
    specialization: "Fullstack",
    icon: "bxl-nodejs",
    color: "text-green-500",
    issuer: "The Odin Project",
    issue_date: "2023-08-15",
    credential_url: "#",
    description: "Comprehensive curriculum covering HTML, CSS, JavaScript, React, Node.js and Databases."
  },
  {
    id: 6,
    coursera_name: "UI/UX Design Specialization",
    specialization: "Design",
    icon: "bxs-palette",
    color: "text-purple-400",
    issuer: "CalArts",
    issue_date: "2023-06-10",
    credential_url: "#",
    description: "Design-centric approach to user interface and user experience design."
  },
  {
    id: 7,
    coursera_name: "Docker for Developers",
    specialization: "DevOps",
    icon: "bxl-docker",
    color: "text-blue-400",
    issuer: "Docker Inc.",
    issue_date: "2024-02-01",
    credential_url: "#",
    description: "Containerization fundamentals, Docker Compose, and orchestration basics."
  },
];

export default function Certification() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const limit = 6;
  const totalPages = Math.ceil(MOCK_CERTS.length / limit);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Simulate API Delay
      await new Promise(r => setTimeout(r, 600));

      const start = (page - 1) * limit;
      const end = start + limit;
      setCerts(MOCK_CERTS.slice(start, end));
      setLoading(false);
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
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      {/* Main Container: Dark Mode Style */}
      <MacWindow 
        title="~/certificates — -bash" 
        className="dark max-w-5xl h-[85vh] md:h-[650px] shadow-2xl"
      >
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white">

          {/* --- HEADER: TOOLBAR --- */}
          <div className="h-14 bg-[#252525] border-b border-white/10 flex items-center px-4 justify-between gap-4 shrink-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-gray-400 text-sm bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
              <i className='bx bxs-certification text-yellow-500'></i>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-white">certificates</span>
            </div>

            {/* Search Input */}
            <div className="relative w-48 md:w-64">
              <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'></i>
              <input
                disabled
                placeholder="Search certificate..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-200 
                           placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* --- CONTENT AREA: GRID LAYOUT --- */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-[#1e1e1e] relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {loading ? (
                // Loading Skeleton (Dark Mode)
                Array.from({ length: limit }).map((_, idx) => (
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
                // Empty State
                <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-500 mt-20">
                  <i className='bx bx-certification text-6xl mb-3 opacity-50'></i>
                  <p>No Certificates Found</p>
                </div>
              ) : (
                // Real Card (Dark Mode)
                certs.map(cert => (
                  <div 
                    key={cert.id} 
                    className="group bg-[#252525] border border-white/5 hover:border-yellow-500/30 hover:bg-[#2a2a2a] 
                               rounded-xl p-5 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1"
                  >
                    {/* Header: Icon & External Link */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-[#1e1e1e] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        <i className={`bx ${cert.icon} text-3xl ${cert.color}`}></i>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {cert.credential_url && (
                          <a 
                            href={cert.credential_url} 
                            target="_blank" 
                            className="text-gray-500 hover:text-white transition-colors"
                            title="Verify Credential"
                          >
                            <i className='bx bx-link-external text-xl'></i>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Body: Info */}
                    <h3 className="font-bold text-gray-100 text-[15px] mb-1 leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2" title={cert.coursera_name}>
                      {cert.coursera_name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 font-medium flex items-center gap-1.5">
                      <i className='bx bxs-institution text-gray-600'></i> {cert.issuer}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    {/* Footer: Tags */}
                    <div className="mt-auto flex gap-2 flex-wrap">
                      {/* Date Tag */}
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#1e1e1e] text-gray-400 border border-white/5 font-mono">
                        {formatDate(cert.issue_date)}
                      </span>
                      
                      {/* Specialization Tag */}
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
              {certs.length > 0 ? `${MOCK_CERTS.length} verified credentials` : '0 items'}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400">Page {page} of {totalPages}</span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 1} 
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 transition-colors"
                  >
                    <i className='bx bx-chevron-left text-lg'></i>
                  </button>
                  <button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page === totalPages} 
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
    </section>
  );
}