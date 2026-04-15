'use client';

// Note: place zvaprofile.jpeg in the public/ folder

export default function AboutSection() {
  return (
    <section className="about-section active">
      <div className="about-content">
        <h2>Wie ik ben</h2>
        <p>
          Ik ben een gepassioneerde fotograaf met een oog voor detail en een liefde voor het
          vastleggen van authentieke momenten.
        </p>
        <p>
          Mijn werk wordt gekenmerkt door een unieke visuele stijl en aandacht voor compositie,
          licht en emotie. Elk project is een nieuwe kans om verhalen te vertellen door middel
          van beelden.
        </p>
        <p>
          Met jarenlange ervaring in diverse fotografische disciplines, streef ik ernaar om unieke
          perspectieven te bieden en beelden te creëren die resoneren.
        </p>
      </div>
      <div className="about-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/zvaprofile.jpeg" alt="Fotograaf" />
      </div>
    </section>
  );
}
