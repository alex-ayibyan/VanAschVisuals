'use client';

import Image from 'next/image';

interface HeroSectionProps {
  onScrollToProjects: () => void;
}

export default function HeroSection({ onScrollToProjects }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-media">
        <Image
          src="/images/project1/part2/foto1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-content">
        <p className="hero-kicker">Fotografie — Antwerpen, België</p>
        <h1 className="hero-title">
          <span className="line"><span>Van Asch</span></span>
          <span className="line"><span>Visuals</span></span>
        </h1>
        <div className="hero-meta">
          <span>Authentieke momenten, vastgelegd in beeld</span>
          <button className="hero-scroll-cue" onClick={onScrollToProjects}>
            Bekijk projecten <span className="arrow">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
