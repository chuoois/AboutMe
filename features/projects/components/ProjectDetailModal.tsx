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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <MacWindow title={project.title} className="dark shadow-2xl">
          <div className="apple-section-dark text-white min-h-[500px] max-h-[85vh] overflow-y-auto">
            <div className="p-8">
              {/* Header with large icon */}
              <div className="flex items-start gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-[#1c1c1e] border border-white/10 apple-shadow flex-shrink-0">
                  <i className={`bx ${project.icon || 'bx-code-alt'} text-6xl ${project.color || 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h2 className="apple-h3 font-bold text-white mb-4">{project.title}</h2>
                  <div className="flex flex-wrap gap-3">
                    {project.git_url && (
                      <a 
                        href={project.git_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 apple-btn-secondary border border-white/10"
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
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="apple-body font-semibold text-gray-300 mb-3">Description</h3>
                <p className="text-gray-400 leading-relaxed apple-body whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="apple-body font-semibold text-gray-300 mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-[#1c1c1e] text-gray-300 border border-white/10 font-medium apple-small"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MacWindow>
      </div>
    </div>
  );
}
