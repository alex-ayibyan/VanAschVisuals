'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Photo, Project } from '@/types';
import GallerySection from './GallerySection';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const subtitle = [project.year, project.location].filter(Boolean).join(' — ');
  // null = still loading. Photos are fetched once per project and shared by all parts,
  // instead of every part fetching the whole photo collection again.
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadPhotos() {
      let loaded: Photo[] = [];
      try {
        const q = query(collection(db, `projects/${project.id}/photos`), orderBy('order'));
        const snap = await getDocs(q);
        loaded = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Photo, 'id'>) }));
      } catch {
        // Firestore unavailable — parts fall back to their local folder
      }
      if (!cancelled) setPhotos(loaded);
    }
    loadPhotos();
    return () => {
      cancelled = true;
    };
  }, [project.id]);

  return (
    <section className="portfolio-section">
      <div className="portfolio-header">
        <h2>{project.title}</h2>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      <div className="project-parts">
        {project.parts.map((part, i) => (
          <GallerySection
            key={part.id}
            part={part}
            partIndex={i}
            projectTitle={project.title}
            photos={photos}
          />
        ))}
      </div>
    </section>
  );
}
