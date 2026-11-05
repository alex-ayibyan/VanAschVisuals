'use client';

import { cldUrl } from '@/lib/cloudinary';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const meta = [project.year, project.location].filter(Boolean).join(' — ');

  return (
    <article className="p-card reveal" onClick={onClick}>
      <div className="p-card-media">
        {project.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cldUrl(project.coverUrl, 'card')}
            alt={project.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="p-card-placeholder">Coming soon</div>
        )}
        {meta && <span className="p-card-tag">{meta}</span>}
      </div>
      <div className="p-card-meta">
        <span className="p-card-index">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="p-card-title">{project.title}</h3>
        {project.year && <span className="p-card-year">{project.year}</span>}
      </div>
      <span className="p-card-cta">Bekijk project →</span>
    </article>
  );
}
