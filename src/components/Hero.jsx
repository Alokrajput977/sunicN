import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   VIDEOS — direct URL links. Swap any `src` for your own hosted
   video link any time (Cloudinary, S3, your own CDN, etc.) — no
   other code changes needed.
   ================================================================ */
const CLIPS = [
  {
    id: 'fleet',
    tile: 'a',
    label: 'Fleet / Highway corridor',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1785916712/istockphoto-500124416-640_adpp_is_kuoi8l.mp4',
  },
  {
    id: 'rail',
    tile: 'b',
    label: 'Rail / Intermodal yard',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1785918084/istockphoto-1279548706-640_adpp_is_online-video-cutter.com_chwlhb.mp4',
  },
  {
    id: 'port',
    tile: 'c',
    label: 'Port / Container ops',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1785830397/one_xlsfem.mp4',
  },
  {
    id: 'air',
    tile: 'd',
    label: 'Air / Cargo apron',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1785830249/three_scjled.mp4',
  },
  {
    id: 'coldchain',
    tile: 'e',
    label: 'Cold chain / Storage',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1785830520/port_m8nalk.mp4',
  },
  {
    id: 'warehouse',
    tile: 'f',
    label: 'Warehouse / Distribution',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1788177708/208160_wxf64v.mp4',
  },
];

/* ==========================================================================
   Lightbox — opens on double-click, video shown large with a blurred
   backdrop over the rest of the page.
   ========================================================================== */

const VideoLightbox = ({ clip, onClose }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 0, scale: 0.85 });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.to(panelRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.5)',
      delay: 0.05,
    });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    gsap.to(panelRef.current, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power2.in' });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  return createPortal(
    <div
      className="hero-lb__overlay"
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className="hero-lb__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={clip.label}
      >
        <button className="hero-lb__close" onClick={handleClose} aria-label="Close" type="button">
          ✕
        </button>
        <video
          className="hero-lb__video"
          src={clip.src}
          autoPlay
          loop
          controls
          playsInline
        />
        <span className="hero-lb__label">{clip.label}</span>
      </div>
    </div>,
    document.body
  );
};

/* ==========================================================================
   Collage tile — 3D mouse-tilt + idle float + double-click to expand
   ========================================================================== */

const CollageTile = ({ tileClass, badge, src, onExpand }) => {
  const innerRef = useRef(null);

  const handleMove = (e) => {
    const el = innerRef.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, { rotateY: px * 10, rotateX: -py * 10, duration: 0.5, ease: 'power2.out' });
  };

  const handleLeave = () => {
    gsap.to(innerRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
  };

  return (
    <div className={`hero__tile hero__tile--${tileClass}`}>
      <div
        className="hero__tile-inner"
        ref={innerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onDoubleClick={onExpand}
        role="button"
        tabIndex={0}
        aria-label={`Expand ${badge}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onExpand();
        }}
      >
        <video className="hero__tile-media" src={src} autoPlay loop muted playsInline />
        <span className="hero__tile-rec" aria-hidden="true" />
        <span className="hero__tile-badge">{badge}</span>
        <span className="hero__tile-expand-hint" aria-hidden="true">⤢ Double-click to expand</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   Hero
   ========================================================================== */

const Hero = () => {
  const heroRef = useRef(null);
  const [expandedClip, setExpandedClip] = useState(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero__badge', { y: 20, opacity: 0, duration: 0.6 })
        .from('.hero__title-line', { y: 50, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.3')
        .from('.hero__subtitle', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero__cta', { y: 16, opacity: 0, duration: 0.5, scale: 0.95 }, '-=0.3')
        .from(
          '.hero__tile',
          { y: 40, opacity: 0, scale: 0.85, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)' },
          '-=0.2'
        );

      if (prefersReducedMotion) return;

      gsap.utils.toArray('.hero__tile').forEach((el, i) => {
        gsap.to(el, {
          y: '+=8',
          duration: 3 + (i % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2.2 + i * 0.2,
        });
      });

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1241px)', () => {
        gsap.utils.toArray('.hero__tile').forEach((el, i) => {
          gsap.to(el, {
            yPercent: (i % 2 === 0 ? -10 : 10) - i,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__glow hero__glow--teal" />
        <div className="hero__glow hero__glow--amber" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span className="hero__title-line">AI-Powered Yard Intelligence</span>
            <span className="hero__title-line hero__title-line--accent">
              PUTS YOU IN CONTROL OF EVERY MILE
            </span>
          </h1>

          <p className="hero__subtitle">
            From container OCR and automatic gates to GPS tracking and warehouse counting. From
            fiber cabling and load balancing to data center setup and 24x7 support. Sunic
            delivers everything — automation, networking, storage, and maintenance.
          </p>

          <div className="hero__badge">
            <span className="hero__stars" aria-hidden="true">★★★★★</span>
            <span className="hero__badge-text">4.9</span>
            <span className="hero__badge-muted">based on 12,00+ Project</span>
          </div>

          <a href="#contact" className="hero__cta">Track project</a>
        </div>

        <div className="hero__collage">
          {CLIPS.map((clip) => (
            <CollageTile
              tileClass={clip.tile}
              badge={clip.label}
              src={clip.src}
              key={clip.id}
              onExpand={() => setExpandedClip(clip)}
            />
          ))}
        </div>
      </div>

      {expandedClip && (
        <VideoLightbox clip={expandedClip} onClose={() => setExpandedClip(null)} />
      )}
    </section>
  );
};

export default Hero;