'use client';

// Note: place zvalogo-removebg-preview.png in the public/ folder

interface HeroSectionProps {
  onAbout: () => void;
  onWork: () => void;
  onContact: () => void;
}

export default function HeroSection({ onAbout, onWork, onContact }: HeroSectionProps) {
  return (
    <section className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/zvalogo-removebg-preview.png" alt="Ziggy Van Asch Logo" />
      <p className="tagline">Fotografie</p>
      <div className="nav-buttons">
        <button className="btn" onClick={onAbout}>Wie ben ik</button>
        <button className="btn" onClick={onWork}>Mijn projecten</button>
        <button className="btn" onClick={onContact}>Contact</button>
      </div>
    </section>
  );
}
