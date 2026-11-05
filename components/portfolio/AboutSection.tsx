'use client';

export default function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="section-head reveal">
        <h2 className="section-title">Over mij</h2>
      </div>
      <div className="about-inner">
        <div className="about-copy reveal">
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
        <div className="about-image reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/zvaprofile.jpeg" alt="Ziggy Van Asch, fotograaf" />
        </div>
      </div>
    </section>
  );
}
