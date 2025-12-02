'use client';

import { SOCIAL_LINKS } from '@/constants/social';

export default function Hero() {
  return (
    <section className="tab-content active">
      <div className="hero-container">
        <div className="avatar-wrapper">
          <img
            src="https://cdn-media.sforum.vn/storage/app/media/THANHAN/avartar-anime-91.jpg"
            className="hero-avatar"
            alt="Avatar"
          />
        </div>

        <h1 className="hero-title">HELLO_WORLD</h1>
        <h2 className="hero-subtitle">Fullstack Dev & Chill Vibes</h2>

        <p className="hero-bio">
          "Viết code như viết nhật ký. Thích sự đơn giản, pixels và cà phê sữa đá."
        </p>

        <div className="status-box">
          <span style={{ color: 'var(--rose)' }}>user@thinh:~$</span>{' '}
          <span className="typing-cursor">coding_lofi_music...</span>
        </div>

        <br />
        <br />

        <div className="social-links">
          <a href={SOCIAL_LINKS.github} target="_blank" className="social-link">
            <i className="bx bxl-github"></i>
          </a>

          <a href={SOCIAL_LINKS.discord} target="_blank" className="social-link">
            <i className="bx bxl-discord"></i>
          </a>

          <a href={SOCIAL_LINKS.facebook} target="_blank" className="social-link">
            <i className="bx bxl-facebook"></i>
          </a>

          <a href={SOCIAL_LINKS.instagram} target="_blank" className="social-link">
            <i className="bx bxl-instagram"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
