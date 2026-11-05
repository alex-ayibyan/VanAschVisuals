'use client';

import { useMemo, useRef, useState } from 'react';
import { cldUrl } from '@/lib/cloudinary';
import { ProjectPart, LightboxImage, Photo } from '@/types';
import Lightbox from './Lightbox';

interface GallerySectionProps {
  part: ProjectPart;
  partIndex: number;
  projectTitle: string;
  /** All photos of the project (fetched once by ProjectDetail); null while loading */
  photos: Photo[] | null;
}

export default function GallerySection({ part, partIndex, projectTitle, photos }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loading = photos === null;

  const images = useMemo<LightboxImage[]>(() => {
    if (!photos) return [];
    const fromFirestore = photos
      .filter((p) => p.partId === part.id)
      .map((p) => ({ src: p.url, title: projectTitle, description: part.title }));
    if (fromFirestore.length > 0) return fromFirestore;

    // Folder-based fallback for local images: optimistically list foto1..foto100
    // and rely on img onError to hide the ones that don't exist
    if (!part.folder) return [];
    return Array.from({ length: 100 }, (_, i) => ({
      src: `/${part.folder}/foto${i + 1}.jpg`,
      title: projectTitle,
      description: part.title,
    }));
  }, [photos, part.id, part.folder, part.title, projectTitle]);

  const scroll = (dir: 1 | -1) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += dir * 500;
    }
  };

  const handleNavigate = (dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    const next = lightboxIndex + dir;
    if (next >= 0 && next < images.length) {
      setLightboxIndex(next);
    }
  };

  return (
    <div className="project-part">
      <div className="part-header">
        <span className="part-number">0{partIndex + 1}</span>
        <span className="part-title">{part.title}</span>
      </div>

      {loading ? (
        <div className="gallery-loading">
          <div className="gallery-loading-spinner" />
          <span>Foto&apos;s laden…</span>
        </div>
      ) : images.length === 0 ? (
        <div className="gallery-loading">
          <span>Foto&apos;s volgen binnenkort</span>
        </div>
      ) : (
        <div className="gallery-container">
          <button className="gallery-nav-btn prev" onClick={() => scroll(-1)}>‹</button>
          <div className="gallery-scroll" ref={scrollRef}>
            {images.map((img, i) => (
              <div key={i} className="gallery-item">
                <div
                  className="gallery-image-wrapper"
                  onClick={() => setLightboxIndex(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cldUrl(img.src, 'gallery')}
                    alt={`${projectTitle} — ${part.title} — ${i + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const item = target.closest('.gallery-item') as HTMLElement | null;
                      if (item) item.style.display = 'none';
                    }}
                  />
                </div>
                <div className="gallery-caption">
                  <h3>{projectTitle}</h3>
                  <p>{part.title}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="gallery-nav-btn next" onClick={() => scroll(1)}>›</button>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
