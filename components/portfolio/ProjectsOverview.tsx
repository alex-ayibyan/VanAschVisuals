'use client';

import { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface ProjectsOverviewProps {
  projects: Project[];
  onProjectClick: (id: string) => void;
}

const SKELETON_COUNT = 3;

export default function ProjectsOverview({ projects, onProjectClick }: ProjectsOverviewProps) {
  return (
    <section className="projects-overview active">
      <div className="portfolio-header">
        <h2>Mijn Projecten</h2>
        <p className="subtitle">Portfolio</p>
      </div>
      <div className="projects-grid">
        {projects.length === 0
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="project-card project-card-skeleton" />
            ))
          : projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onProjectClick(project.id)}
              />
            ))}
      </div>
    </section>
  );
}
