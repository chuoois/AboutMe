'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchdata';
import { formatMonthYear } from '@/lib/format';
import { paginationBtnStyle } from '@/utils/paginationStyle';

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

  // States cho phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // Số lượng chứng chỉ mỗi trang

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Gọi API có phân trang
        const res = await fetchData(`/api/coursera-certificates?page=${page}&limit=${limit}`);
        const data = res.data || (Array.isArray(res) ? res : []);
        const total = res.totalPages || 1;

        setCerts(data);
        setTotalPages(total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  // Hàm chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll nhẹ lên đầu danh sách
      const listElement = document.querySelector('.section-title');
      if (listElement) listElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="tab-content active">
      <h2 className="section-title">./licenses_&_certs</h2>

      <div className="cert-list">
        {loading ? (
          <div className="text-center w-full py-8" >
            <span className="typing-cursor">LOADING_DATA...</span>
          </div>
        ) : certs.length === 0 ? (
          <p className="text-center w-full py-4" style={{ color: 'var(--text-muted)' }}>
            [EMPTY_LIST]
          </p>
        ) : (
          certs.map((cert, index) => (
            <div
              key={`${cert.id}-${index}`}
              className="cert-item"
            >
              {/* Date Column */}
              <div className="cert-date">
                {formatMonthYear(cert.issue_date)}
              </div>

              {/* Icon */}
              <i
                className={`bx ${cert.icon} cert-icon`}
                style={{ color: cert.iconColor || 'var(--gold)' }}
              ></i>

              {/* Content */}
              <div className="cert-content">
                <h4>{cert.coursera_name}</h4>
                <p>{cert.description}</p>
                {/* Optional: Link verification */}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--foam)', fontSize: '12px', marginTop: '5px', display: 'inline-block', textDecoration: 'none' }}
                  >
                    &gt; VERIFY_CREDENTIAL
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- RETRO PAGINATION --- */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '40px',
          fontFamily: "'VT323', monospace"
        }}>
          {/* Nut Prev */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={paginationBtnStyle(page === 1)}
          >
            &lt; PREV
          </button>

          {/* Page Numbers */}
          <span style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--surface)',
            padding: '0 15px',
            border: '1px solid var(--overlay)',
            color: 'var(--gold)',
            fontSize: '20px'
          }}>
            {page} / {totalPages}
          </span>

          {/* Nut Next */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            style={paginationBtnStyle(page === totalPages)}
          >
            NEXT &gt;
          </button>
        </div>
      )}
    </section>
  );
}