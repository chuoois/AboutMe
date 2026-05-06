// features/projects/components/ProjectCard.tsx
// Presentational component - no data fetching, just renders a project card
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1c1c1e] border border-white/5 hover:border-blue-500/30 hover:bg-[#2c2c2e] 
                 rounded-xl p-5 transition-all duration-300 flex flex-col hover:apple-shadow hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-black border border-white/5 group-hover:scale-110 transition-transform duration-300">
          <i className={`bx ${project.icon || 'bx-code-alt'} text-3xl ${project.color || 'text-gray-400'}`} />
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
          {project.git_url && (
            <a href={project.git_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" title="Source Code">
              <i className='bx bxl-github text-xl' />
            </a>
          )}
          {project.live_demo_url && (
            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="p-2 hover:bg-blue-500/20 rounded-full text-gray-400 hover:text-blue-400 transition-colors" title="Live Demo">
              <i className='bx bx-link-external text-xl' />
            </a>
          )}
        </div>
      </div>

      <h3 className="apple-body font-bold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
        {project.title}
      </h3>
      <p className="apple-small text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
        {project.description}
      </p>

      <div className="flex gap-2 flex-wrap">
        {project.tags?.slice(0, 3).map((t, i) => (
          <span
            key={i}
            className="apple-micro px-2.5 py-1 rounded-full bg-black text-gray-400 border border-white/5 font-medium tracking-wide"
          >
            {t}
          </span>
        ))}
        {project.tags && project.tags.length > 3 && (
          <span className="apple-micro px-2 py-1 text-gray-600">+{project.tags.length - 3}</span>
        )}
      </div>
    </div>
  );
}
