'use client';

import { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface ProjectsOverviewProps {
  projects: Project[];
  onProjectClick: (id: string) => void;
}

const SKELETON_COUNT = 6;

export default function ProjectsOverview({ projects, onProjectClick }: ProjectsOverviewProps) {
  return (
    <section className="section" id="projects">
      <div className="section-head reveal">
        <h2 className="section-title">Projecten</h2>
        <span className="section-count">
          {projects.length > 0 ? `${String(projects.length).padStart(2, '0')} — Portfolio` : 'Portfolio'}
        </span>
      </div>
      <div className="projects-grid">
        {projects.length === 0
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="p-card p-card-skel">
                <div className="p-card-media" />
              </div>
            ))
          : projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={() => onProjectClick(project.id)}
              />
            ))}
      </div>
    </section>
  );
}
