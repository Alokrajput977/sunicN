import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const LINKS = [
  { label: 'About', to: '/About' },
  { label: 'Clients', to: '/clients' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

const SIDEBAR_ID = 'navbar-mobile-sidebar';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const burgerRef = useRef(null);
  const closeBtnRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // ---- Scroll shadow/blur state (passive listener, only updates on change) ----
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll(); // run once on mount so refreshing mid-scroll is handled too
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- Lock page scroll while the mobile sidebar is open (class-based, no inline styles) ----
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [menuOpen]);

  // ---- Close the sidebar automatically if the viewport grows past the mobile breakpoint ----
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) closeMenu();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [closeMenu]);

  // ---- Close the sidebar whenever the route changes ----
  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ---- Close on Escape key while sidebar is open ----
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  // ---- Focus management: move focus into the sidebar on open, back to the burger on close ----
  useEffect(() => {
    if (menuOpen) {
      closeBtnRef.current?.focus();
    } else {
      burgerRef.current?.focus();
    }
  }, [menuOpen, burgerRef, closeBtnRef]);

  // ---- Handle logo click - scroll to top ----
  const handleLogoClick = (e) => {
    closeMenu();
    // If we're already on the home page, scroll to top
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--menu-open' : ''}`}>
      <div className="container navbar__inner">
        <Link 
          to="/" 
          className="navbar__logo" 
          aria-label="Sunic Logistics home" 
          onClick={handleLogoClick}
        >
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
            type="button"
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className={`navbar__theme-icon ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
              {theme === 'dark' ? '☾' : '☀'}
            </span>
          </button>

          <button
            ref={burgerRef}
            type="button"
            className={`navbar__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls={SIDEBAR_ID}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ---------- Mobile sidebar ---------- */}
      <div className={`navbar__scrim ${menuOpen ? 'is-visible' : ''}`} onClick={closeMenu} />

      <aside
        id={SIDEBAR_ID}
        className={`navbar__sidebar ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="navbar__sidebar-head">
          <Link 
            to="/" 
            className="navbar__sidebar-logo" 
            onClick={handleLogoClick}
          >
            <img src="/logo.png" alt="Sunic Logistics" />
          </Link>
          <button
            ref={closeBtnRef}
            type="button"
            className="navbar__sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
          >
            <span />
            <span />
          </button>
        </div>

        <nav className="navbar__sidebar-links">
          {LINKS.map((link, i) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `navbar__sidebar-link ${i === LINKS.length - 1 ? 'navbar__sidebar-link--cta' : ''} ${isActive ? 'is-active' : ''
                }`
              }
              style={{ transitionDelay: menuOpen ? `${0.06 + i * 0.05}s` : '0s' }}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="navbar__sidebar-link-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="navbar__sidebar-link-label">{link.label}</span>
              <span className="navbar__sidebar-link-arrow" aria-hidden="true">→</span>
            </NavLink>
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