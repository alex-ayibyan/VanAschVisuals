'use client';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-wordmark">Van Asch Visuals</div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Ziggy Van Asch</span>
        <a
          href="https://www.instagram.com/vanaschvisuals/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
