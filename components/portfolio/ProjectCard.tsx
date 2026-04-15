'use client';

import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const subtitle = [project.year, project.location].filter(Boolean).join(' — ');

  return (
    <div className="project-card" onClick={onClick}>
      {project.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="project-card-image"
          src={project.coverUrl}
          alt={project.title}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="project-card-placeholder">✦</div>
      )}
      <div className="project-card-overlay">
        <div className="project-card-title">{project.title}</div>
        {subtitle && <div className="project-card-subtitle">{subtitle}</div>}
        {project.description && (
          <div className="project-card-description">{project.description}</div>
        )}
      </div>
    </div>
  );
}
