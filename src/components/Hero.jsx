import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

// Local videos from src/video/ — CRA bundles these on import and gives you
// a working URL back. Rename your 6 files to match these (or edit the paths
// below to match whatever you name them).
import fleetVideo from '../video/one.mp4';
import railVideo from '../video/two.mp4';
import portVideo from '../video/five.mp4';
import airVideo from '../video/four.mp4';
import coldchainVideo from '../video/six.mp4';
import warehouseVideo from '../video/three.mp4';

gsap.registerPlugin(ScrollTrigger);

const CLIPS = [
  { id: 'fleet', tile: 'a', label: 'Fleet / Highway corridor', src: fleetVideo },
  { id: 'rail', tile: 'b', label: 'Rail / Intermodal yard', src: railVideo },
  { id: 'port', tile: 'c', label: 'Port / Container ops', src: portVideo },
  { id: 'air', tile: 'd', label: 'Air / Cargo apron', src: airVideo },
  { id: 'coldchain', tile: 'e', label: 'Cold chain / Storage', src: coldchainVideo },
  { id: 'warehouse', tile: 'f', label: 'Warehouse / Distribution', src: warehouseVideo },
];

/* ==========================================================================
   Collage tile — real-time 3D mouse-tilt + a slow idle float (GSAP)
   ========================================================================== */

const CollageTile = ({ tileClass, badge, src }) => {
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
      >
        <video className="hero__tile-media" src={src} autoPlay loop muted playsInline />
        <span className="hero__tile-rec" aria-hidden="true" />
        <span className="hero__tile-badge">{badge}</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   Hero
   ========================================================================== */

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
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

      // Gentle idle float, starting once the entrance has roughly settled —
      // keeps the collage feeling alive without competing with the entrance.
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

      // Scroll parallax — each tile drifts at a slightly different rate
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
            From container OCR and automatic gates to GPS tracking and warehouse counting. From fiber cabling and load balancing to data center setup and 24x7 support. Sunic delivers everything — automation, networking, storage, and maintenance.
          </p>

          <div className="hero__badge">
            <span className="hero__stars" aria-hidden="true">★★★★★</span>
            <span className="hero__badge-text">4.9</span>
            <span className="hero__badge-muted">based on 12,00+ Project</span>
          </div>

          <a href="#contact" className="hero__cta">Track  project</a>
        </div>

        <div className="hero__collage">
          {CLIPS.map((clip) => (
            <CollageTile tileClass={clip.tile} badge={clip.label} src={clip.src} key={clip.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;