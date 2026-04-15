'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProjectPart, LightboxImage, Photo } from '@/types';
import Lightbox from './Lightbox';

interface GallerySectionProps {
  projectId: string;
  part: ProjectPart;
  partIndex: number;
  projectTitle: string;
}

export default function GallerySection({ projectId, part, partIndex, projectTitle }: GallerySectionProps) {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      try {
        // Fetch all photos for this project, filter by partId client-side
        // (avoids needing a composite Firestore index)
        const q = query(
          collection(db, `projects/${projectId}/photos`),
          orderBy('order')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const photos: LightboxImage[] = snap.docs
            .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Photo, 'id'>) }))
            .filter((p) => p.partId === part.id)
            .map((p) => ({ src: p.url, title: projectTitle, description: part.title }));
          if (photos.length > 0) {
            setImages(photos);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Firestore failed or no data — fall through to folder discovery
      }

      // Folder-based fallback
      if (part.folder) {
        const discovered: LightboxImage[] = [];
        for (let i = 1; i <= 100; i++) {
          const src = `/${part.folder}/foto${i}.jpg`;
          // We can't HEAD-check images on the client easily, so we optimistically add them
          // and rely on img onerror to hide broken ones in the gallery
          discovered.push({ src, title: projectTitle, description: part.title });
        }
        setImages(discovered);
      }
      setLoading(false);
    }

    loadPhotos();
  }, [projectId, part, projectTitle]);

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
                    src={img.src}
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
