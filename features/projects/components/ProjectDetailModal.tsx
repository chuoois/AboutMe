'use client';

import type { Project } from '@/types';
import MacWindow from '@/components/layout/MacWindow';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" 
      onClick={onClose}
    >
      <div 
        className="apple-section-light border border-black/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#f5f5f7] border-b border-black/10 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="apple-h3 font-semibold text-[#1d1d1f] flex items-center gap-3">
            <i className={`bx ${project.icon || 'bx-code-alt'} text-2xl ${project.color || 'text-[#1d1d1f]'}`} />
            {project.title}
          </h2>
          <button onClick={onClose} className="text-[#86868b] hover:text-[#1d1d1f] transition-colors">
            <i className='bx bx-x text-2xl' />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.git_url && (
                <a 
                  href={project.git_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 apple-btn-secondary border border-black/10"
                >
                  <i className='bx bxl-github text-xl' />
                  Source Code
                </a>
              )}
              {project.live_demo_url && (
                <a 
                  href={project.live_demo_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 apple-btn-primary border border-blue-500/30"
                >
                  <i className='bx bx-link-external text-xl' />
                  Live Demo
                </a>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-[#86868b] mb-2 uppercase tracking-wider font-semibold">Description</p>
              <p className="text-[#1d1d1f] leading-relaxed apple-body whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div>
              <p className="text-sm text-[#86868b] mb-3 uppercase tracking-wider font-semibold">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-black/5 font-medium apple-small"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
