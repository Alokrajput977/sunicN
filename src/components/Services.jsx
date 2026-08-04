import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

// NOTE: placeholder clip from src/video — swap for your own real port /
// route footage before launch.
import railVideo from '../video/yard.mp4';

gsap.registerPlugin(ScrollTrigger);

const MODES = [
  {
    n: '1',
    accent: 'teal',
    code: 'PRODUCT / YARD',
    title: 'Yard Management System',
    desc: 'End-to-end container yard visibility — track, allocate and move every box in real time across your terminal.',
  },
  {
    n: '2',
    accent: 'amber',
    code: 'PRODUCT / WAREHOUSE',
    title: 'Warehouse Automation',
    desc: 'Smart storage, pick-pack-ship and inventory control built to run bonded and cross-dock warehouses at scale.',
  },
  {
    n: '3',
    accent: 'rose',
    code: 'PRODUCT / RAIL',
    title: 'Rail Terminal Solutions',
    desc: 'Rake planning, wagon tracking and intermodal handoff tools that keep rail-linked terminals moving without delay.',
  },
  {
    n: '4',
    accent: 'violet',
    code: 'PRODUCT / GATE',
    title: 'Gate Automation',
    desc: 'Unmanned gate-in / gate-out with OCR, e-seal verification and digital documentation — zero paperwork, zero queues.',
  },
];

/* ==========================================================================
   Shared 3D mouse-tilt — same technique used across the site
   ========================================================================== */

const useTilt = (strength = 8) => {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, { rotateY: px * strength, rotateX: -py * strength, duration: 0.5, ease: 'power2.out' });
  };

  const onMouseLeave = () => {
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
  };

  return { ref, onMouseMove, onMouseLeave };
};

const StackCard = ({ mode }) => {
  const { ref, onMouseMove, onMouseLeave } = useTilt(6);

  return (
    <div
      className={`stack-card stack-card--${mode.n} stack-card--${mode.accent}`}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <span className="stack-card__num">{mode.n}</span>
      <div className="stack-card__body">
        <span className="eyebrow stack-card__code">{mode.code}</span>
        <h3 className="stack-card__title">{mode.title}</h3>
        <p className="stack-card__desc">{mode.desc}</p>
      </div>
    </div>
  );
};

/* ==========================================================================
   Right side — just the video, nothing else
   ========================================================================== */

const MediaPanel = () => {
  const { ref, onMouseMove, onMouseLeave } = useTilt(4);

  return (
    <div className="media-panel" ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <video className="media-panel__video" src={railVideo} autoPlay loop muted playsInline />
    </div>
  );
};

/* ==========================================================================
   Section — heading reveals + locks at top while pinned, then the 4 cards
   and video reveal on the scrubbed timeline underneath it
   ========================================================================== */

const Services = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading: plain (non-scrubbed) reveal. Fires as it scrolls into view,
      // well BEFORE the pin engages — so by the time it locks to the top,
      // it's already fully visible.
      gsap.from('.services__head > *', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services__head', start: 'top 88%' },
      });

      const mm = gsap.matchMedia();

      // Desktop / tablet — pin the section. Heading sits at the top of the
      // pinned box, so it locks in place naturally when pinning engages.
      // Video + cards then animate on the same scrubbed timeline as before.
      mm.add('(min-width: 900px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.services__pin',
            start: 'top top',
            end: '+=200%',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          '.media-panel',
          { xPercent: 130, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 1, ease: 'power2.out' },
          0
        )
          .from('.stack-card--1', { y: 90, opacity: 0, duration: 1, ease: 'power2.out' }, 0.1)
          .from('.stack-card--2', { y: 90, opacity: 0, duration: 1, ease: 'power2.out' }, '+=0.15')
          .from('.stack-card--3', { y: 90, opacity: 0, duration: 1, ease: 'power2.out' }, '+=0.15')
          .from('.stack-card--4', { y: 90, opacity: 0, duration: 1, ease: 'power2.out' }, '+=0.15');
      });

      // Mobile — no pinning (avoids scroll-jank on touch), but the video
      // still scrubs in from off-screen right, repeatably, as you scroll.
      mm.add('(max-width: 899px)', () => {
        gsap.fromTo(
          '.media-panel',
          { xPercent: 130, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              end: 'top 45%',
              scrub: 0.6,
            },
          }
        );

        gsap.from('.stack-card', {
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.services__stack', start: 'top 85%' },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="container">
        <div className="services__pin">
          <div className="services__head">
            <span className="eyebrow">Sunic Technologies / Our Products</span>
            <h2 className="services__title">Products That Run
The Terminal</h2>
            <p className="services__sub">
              Sunic Technologies builds and delivers ready-to-deploy automation products for ports,
              rail terminals and warehouses — from yard operations to gate control, engineered as
              projects tailored to your site.
            </p>
          </div>

          <div className="services__row">
            <div className="services__stack">
              {MODES.map((mode) => (
                <StackCard mode={mode} key={mode.n} />
              ))}
            </div>

            <div className="services__panel">
              <MediaPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;