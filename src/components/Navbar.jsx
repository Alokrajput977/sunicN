import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="Sunic Logistics home">
          <img src="/logo.png" alt="Sunic Logistics" className="navbar__logo-img" />
        </Link>

        <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {LINKS.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              className={`navbar__link ${i === LINKS.length - 1 ? 'navbar__link--cta' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
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
    </header>
  );
};

export default Navbar;