import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const LINKS = [
  { label: 'About', to: '/About' },
  { label: 'Clients', to: '/clients' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Carrier', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // run once on mount so refreshing mid-scroll is handled too
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the mobile sidebar is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : prev || '';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [menuOpen]);

  // Close the sidebar automatically if the viewport grows past
  // the mobile breakpoint (e.g. rotating a tablet, resizing a window)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--menu-open' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="Sunic Logistics home" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Sunic Logistics" className="navbar__logo-img" />
        </Link>

        <nav className="navbar__links">
          {LINKS.map((link, i) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link ${i === LINKS.length - 1 ? 'navbar__link--cta' : ''} ${isActive ? 'is-active' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className={`navbar__theme-icon ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
              {theme === 'dark' ? '☾' : '☀'}
            </span>
          </button>

          <button
            className={`navbar__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ---------- Mobile sidebar ---------- */}
      <div className={`navbar__scrim ${menuOpen ? 'is-visible' : ''}`} onClick={() => setMenuOpen(false)} />

      <aside className={`navbar__sidebar ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="navbar__sidebar-head">
          <Link to="/" className="navbar__sidebar-logo" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Sunic Logistics" />
          </Link>
          <button
            className="navbar__sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span />
            <span />
          </button>
        </div>

        <nav className="navbar__sidebar-links">
          {LINKS.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              className={`navbar__sidebar-link ${i === LINKS.length - 1 ? 'navbar__sidebar-link--cta' : ''}`}
              style={{ transitionDelay: menuOpen ? `${0.06 + i * 0.05}s` : '0s' }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="navbar__sidebar-link-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="navbar__sidebar-link-label">{link.label}</span>
              <span className="navbar__sidebar-link-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>

        <div className="navbar__sidebar-foot">
          <span className="navbar__sidebar-foot-label">Get in touch</span>
          <a href="mailto:info@sunictechnologies.com" className="navbar__sidebar-foot-item">
            info@sunictechnologies.com
          </a>
          <a href="tel:+911240000000" className="navbar__sidebar-foot-item">
            +91 124 000 0000
          </a>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;