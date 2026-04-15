'use client';

import { useEffect } from 'react';
import { LightboxImage } from '@/types';

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const current = images[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, onNavigate]);

  if (!current) return null;

  return (
    <div className="lightbox active" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>×</button>
      <button
        className="lightbox-nav prev"
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
      >
        ‹
      </button>
      <button
        className="lightbox-nav next"
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
      >
        ›
      </button>
      <div className="lightbox-counter">{index + 1} / {images.length}</div>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lightbox-image" src={current.src} alt={current.title} />
      </div>
      {(current.title || current.description) && (
        <div className="lightbox-caption">
          <h3>{current.title}</h3>
          {current.description && <p>{current.description}</p>}
        </div>
      )}
    </div>
  );
}
