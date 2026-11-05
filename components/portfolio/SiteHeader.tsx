'use client';

import { useEffect, useState } from 'react';

interface SiteHeaderProps {
  onHome: () => void;
  onNav: (sectionId: string) => void;
  onBack?: () => void;
  showBack: boolean;
}

export default function SiteHeader({ onHome, onNav, onBack, showBack }: SiteHeaderProps) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const update = () => setPastHero(window.scrollY >= window.innerHeight * 0.75);
    const raf = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
    };
  }, []);

  const onHero = !showBack && !pastHero;

  return (
    <header className={`site-header${onHero ? ' on-hero' : ''}`}>
      <button className="wordmark" onClick={onHome}>
        Van Asch Visuals
      </button>
      {showBack ? (
        <button className="header-back" onClick={onBack}>
          ← Alle projecten
        </button>
      ) : (
        <nav className="site-nav">
          <button onClick={() => onNav('projects')}>Projecten</button>
          <button onClick={() => onNav('about')}>Over mij</button>
          <button onClick={() => onNav('contact')}>Contact</button>
        </nav>
      )}
    </header>
  );
}
