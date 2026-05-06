'use client';

import type { Cert } from '@/types';
import { formatDate } from '@/lib/helpers/date';

interface CertDetailModalProps {
  cert: Cert | null;
  onClose: () => void;
}

export default function CertDetailModal({ cert, onClose }: CertDetailModalProps) {
  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={onClose}>
      <div 
        className="apple-section-dark border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1c1c1e] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="apple-h3 font-semibold text-white flex items-center gap-3">
            <i className={`bx ${cert.icon || 'bxs-certification'} text-2xl ${cert.color || 'text-yellow-500'}`} />
            {cert.coursera_name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <i className='bx bx-x text-2xl' />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-400 mb-1">Issuer</p>
              <p className="text-white font-medium flex items-center gap-2">
                <i className='bx bxs-institution' />
                {cert.issuer}
              </p>
            </div>

            {cert.specialization && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Specialization</p>
                <span className="inline-block px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
                  {cert.specialization}
                </span>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-400 mb-1">Issued Date</p>
              <p className="text-white font-mono">{formatDate(cert.issue_date)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Description</p>
              <p className="text-gray-300 leading-relaxed">{cert.description}</p>
            </div>

            {cert.credential_url && (
              <div className="pt-4">
                <a 
                  href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 apple-btn-secondary"
                >
                  <i className='bx bx-link-external' />
                  View Credential
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
