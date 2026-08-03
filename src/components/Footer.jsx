import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------
   Column data — Sunic Technologies (IT / software company)
---------------------------------------------------------------- */
const SERVICES = [
  'Software Development',
  'Cloud & DevOps',
  'Cybersecurity Solutions',
  'Data & AI Engineering',
  'IT Consulting',
  'Product Support',
];

const INDUSTRIES = [
  'Banking & Financial Services',
  'Retail & E-Commerce',
  'Healthcare',
  'Manufacturing',
  'Government & Public Sector',
  'Education',
  'Logistics & Supply Chain',
  'SaaS Platforms',
];

const COMPANY = ['About Us', 'Careers', 'Leadership', 'News & Press', 'Partners', 'Contact Us'];

const RESOURCES = ['Blog', 'Case Studies', 'Whitepapers', 'Documentation', 'Webinars', 'Support'];

const WORDMARK_WORDS = ['SUNIC', 'TECHNOLOGIES'];

/* ----------------------------------------------------------------
   A nav column whose items get a sliding highlight bar that
   follows whichever link is currently hovered.
---------------------------------------------------------------- */
const HoverColumn = ({ title, items }) => {
  const listRef = useRef(null);
  const barRef = useRef(null);

  const moveBar = (li) => {
    const list = listRef.current;
    const bar = barRef.current;
    if (!list || !bar) return;
    const listBox = list.getBoundingClientRect();
    const itemBox = li.getBoundingClientRect();
    gsap.to(bar, {
      y: itemBox.top - listBox.top,
      height: itemBox.height,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
  };

  const hideBar = () => {
    gsap.to(barRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  };

  return (
    <nav className="ftr__col">
      <span className="ftr__col-title ftr__reveal">
        <span className="ftr__dot" aria-hidden="true" />
        {title}
      </span>
      <ul className="ftr__list" ref={listRef} onMouseLeave={hideBar}>
        <span className="ftr__bar" ref={barRef} aria-hidden="true" />
        {items.map((item) => (
          <li
            className="ftr__link-item"
            key={item}
            onMouseEnter={(e) => moveBar(e.currentTarget)}
          >
            <a href="#" className="ftr__link">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/* ----------------------------------------------------------------
   Footer
---------------------------------------------------------------- */
const Footer = () => {
  const footerRef = useRef(null);
  const wordmarkWrapRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const revealTargets = footerRef.current.querySelectorAll(
          '.ftr__link-item, .ftr__reveal'
        );
        const letters = wordmarkRef.current.querySelectorAll('.ftr__letter');

        if (prefersReducedMotion) {
          gsap.set(revealTargets, { opacity: 1, y: 0 });
          gsap.set(letters, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          revealTargets,
          { opacity: 0, y: -26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.025,
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              end: 'top 40%',
              toggleActions: 'play none play reverse',
            },
          }
        );
        gsap.set(letters, { opacity: 0, y: 46 });

        gsap.to(letters, {
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 1,
          scrollTrigger: {
            trigger: wordmarkWrapRef.current,
            start: 'top 55%',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }, footerRef);

      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    };
    const fontsReady =
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const pageLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

    Promise.all([fontsReady, pageLoaded]).then(build);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <footer className="ftr" ref={footerRef}>
      <div className="ftr__mega container">
        <div className="ftr__brand">
          <a href="#top" className="ftr__logo ftr__reveal" aria-label="Sunic Technologies home">
            <span className="ftr__logo-mark">/\</span>
            <span className="ftr__logo-text">SUNIC</span>
          </a>

          <div className="ftr__cta">
            <a href="#demo" className="ftr__bracket-link ftr__reveal">
              [ Get a Demo ]
            </a>
            <a href="#pricing" className="ftr__bracket-link ftr__reveal">
              [ View Pricing ]
            </a>
          </div>

          <div className="ftr__social">
            <a href="#linkedin" className="ftr__reveal">
              LinkedIn
            </a>
            <a href="#youtube" className="ftr__reveal">
              YouTube
            </a>
          </div>
        </div>

        <HoverColumn title="Services" items={SERVICES} />
        <HoverColumn title="Industries" items={INDUSTRIES} />
        <HoverColumn title="Company" items={COMPANY} />
        <HoverColumn title="Resources" items={RESOURCES} />
      </div>

      <div className="ftr__address container">
        <p className="ftr__address-name ftr__reveal">Sunic Technologies</p>
        <p className="ftr__address-lines ftr__reveal">
          Tower B, B-1, Spaze IT Park, Sohna Road, Gurugram, Haryana, India
        </p>
      </div>

      <div className="ftr__wordmark-wrap" ref={wordmarkWrapRef}>
        <h2 className="ftr__wordmark" ref={wordmarkRef} aria-label="Sunic Technologies">
          {WORDMARK_WORDS.map((word, wi) => (
            <span className="ftr__word" key={word}>
              {word.split('').map((ch, ci) => (
                <span className="ftr__letter" key={`${wi}-${ci}`}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>

      <div className="ftr__bottom container">
        <span className="ftr__reveal">Terms of Service</span>
        <span className="ftr__reveal">Privacy Policy</span>
        <span className="ftr__reveal">Privacy Settings</span>
        <span className="ftr__bottom-copy ftr__reveal">
          © 2026 Sunic Technologies. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;