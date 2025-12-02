'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchdata';

type Skill = {
  id: number;
  category: string;
  skill_name: string;
  icon: string;
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12; 

  useEffect(() => {
    async function load() {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        // Gọi API với page và limit động
        const res = await fetchData(`/api/skills?page=${page}&limit=${limit}`);
        const newData = res.data || [];
      
        if (newData.length < limit) {
          setHasMore(false);
        }

        setSkills((prev) => {
          if (page === 1) return newData;
          return [...prev, ...newData];
        });

      } catch (error) {
        console.error("Failed to load skills", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    load();
  }, [page]); // Chạy lại khi page thay đổi

  // Hàm xử lý khi bấm nút Load More
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const grouped = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const displayName: Record<string, string> = {
    frontend: "Frontend_Stack",
    backend: "Backend_Core",
    tools: "Dev_Tools",
    devops: "DevOps_Engineering",
    mobile: "Mobile_Development",
    ai: "AI_And_Data"
  };

  return (
    <section className="tab-content active">
      <h2 className="section-title">./installed_modules</h2>

      {loading ? (
        <div className="text-center w-full py-8">
          <span className="typing-cursor">SCANNING_MODULES...</span>
        </div>
      ) : (
        <div className="skill-console">
          {skills.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--text-muted)' }}>[NO_MODULES_FOUND]</p>
          ) : (
            Object.keys(grouped).map((cat) => (
              <div key={cat} className="skill-group">
                <div className="skill-cat-title">
                  {displayName[cat] || cat}
                </div>

                <div className="skill-list">
                  {grouped[cat].map((skill, index) => (
                    <div key={`${skill.id}-${index}`} className="skill-chip">
                      <i className={`bx ${skill.icon}`}></i> {skill.skill_name}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- LOAD MORE BUTTON --- */}
      {!loading && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{
              background: 'transparent',
              border: '1px dashed var(--gold)',
              color: 'var(--gold)',
              padding: '10px 20px',
              cursor: loadingMore ? 'wait' : 'pointer',
              fontFamily: "'VT323', monospace",
              fontSize: '18px',
              transition: 'all 0.3s ease',
              opacity: loadingMore ? 0.7 : 1
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {loadingMore ? 'DOWNLOADING...' : 'LOAD_MORE_MODULES [+]'}
          </button>
        </div>
      )}
    </section>
  );
}