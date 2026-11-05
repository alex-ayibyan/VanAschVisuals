'use client';

const ITEMS = ['Fotografie', 'Van Asch Visuals', 'Portret', 'Product', 'Architectuur'];

export default function Marquee() {
  // Track content is duplicated so the -50% translate loops seamlessly
  const chunk = (keyPrefix: string) =>
    ITEMS.map((item, i) => (
      <span className="marquee-chunk" key={`${keyPrefix}-${i}`}>
        {item}
        <span className="sep" aria-hidden="true" />
      </span>
    ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {chunk('a')}
        {chunk('b')}
      </div>
    </div>
  );
}
