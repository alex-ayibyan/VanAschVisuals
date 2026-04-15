'use client';

import { Project } from '@/types';
import GallerySection from './GallerySection';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const subtitle = [project.year, project.location].filter(Boolean).join(' — ');

  return (
    <section className="portfolio-section active">
      <div className="portfolio-header">
        <h2>{project.title}</h2>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      <div className="project-parts">
        {project.parts.map((part, i) => (
          <GallerySection
            key={part.id}
            projectId={project.id}
            part={part}
            partIndex={i}
            projectTitle={project.title}
          />
        ))}
      </div>
    </section>
  );
}
