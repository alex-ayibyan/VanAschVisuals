'use client';

import { FormEvent } from 'react';

export default function ContactSection() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="section" id="contact">
      <div className="section-head reveal">
        <h2 className="section-title">Contact</h2>
        <span className="section-count">Laten we samenwerken</span>
      </div>
      <div className="contact-grid">
        <div className="reveal">
          <p className="contact-lede">
            Een project, samenwerking of gewoon een vraag? Stuur een bericht en ik neem zo snel
            mogelijk contact op.
          </p>
          <a className="contact-big-link" href="mailto:info@jouwmail.com">
            info@jouwmail.com
          </a>
          <div className="contact-item">
            <div className="contact-label">Telefoon</div>
            <div className="contact-value">
              <a href="tel:+32123456789">+32 123 45 67 89</a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-label">Locatie</div>
            <div className="contact-value">België</div>
          </div>
          <div className="contact-item">
            <div className="contact-label">Volg mij</div>
            <div className="social-links">
              <a
                href="https://www.instagram.com/vanaschvisuals/"
                className="social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="reveal">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">Naam</label>
              <input type="text" id="contact-name" name="name" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">Email</label>
              <input type="email" id="contact-email" name="email" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">Onderwerp</label>
              <input type="text" id="contact-subject" name="subject" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Bericht</label>
              <textarea id="contact-message" name="message" className="form-textarea" required></textarea>
            </div>
            <button type="submit" className="form-submit">Verstuur bericht</button>
          </form>
        </div>
      </div>
    </section>
  );
}
