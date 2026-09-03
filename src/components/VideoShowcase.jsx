import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VideoShowcase.css';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   VIDEOS — direct URL links. Swap any `src` for your own hosted
   video link any time (Cloudinary, S3, your own CDN, etc.) — no
   other code changes needed.
   ================================================================ */
const CARDS = [
  {
    id: 'a',
    accent: 'teal',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1785830011/two_zqzjoq.mp4',
    title: 'Rail crane, fully automated',
    body: 'Gantry and rail-mounted cranes operate on automated cycles — lifting, moving and positioning containers without manual coordination at every step.',
  },
  {
    id: 'b',
    accent: 'amber',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1788419466/VIDEO-2026-09-03-12-36-53_afpmjh.mp4',
    title: 'Container and wagon reading',
    body: 'OCR captures container numbers and wagon IDs the moment they enter the yard — matched, verified and logged automatically, no clipboards involved.',
  },
  {
    id: 'c',
    accent: 'violet',
    src: 'https://res.cloudinary.com/kajpumjn/video/upload/v1785829918/four_edzfkm.mp4',
    title: 'Precise slot placement',
    body: 'Every container is lifted and placed at its assigned yard location automatically — the system decides the slot, the crane executes it.',
  },
];

/* ==========================================================================
   Shared 3D mouse-tilt hook — same technique used across the site
   ========================================================================== */

const useTilt = () => {
  const ref = useRef(null);
  const rotateX = useRef(null);
  const rotateY = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    rotateX.current = gsap.quickTo(ref.current, "rotationX", {
      duration: 0.3,
      ease: "power2.out",
    });

    rotateY.current = gsap.quickTo(ref.current, "rotationY", {
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    rotateY.current(x * 8);
    rotateX.current(-y * 8);
  };

  const onMouseLeave = () => {
    rotateX.current(0);
    rotateY.current(0);
  };

  return { ref, onMouseMove, onMouseLeave };
};

const WhyCard = ({ data, tileClass }) => {
  const { ref, onMouseMove, onMouseLeave } = useTilt();

  return (
    <div
      className={`why__card why__card--${tileClass} why__card--${data.accent}`}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <video className="why__card-video" src={data.src} autoPlay loop muted playsInline />
      <div className="why__card-overlay" aria-hidden="true" />
      <div className="why__card-caption">
        <span className="why__card-bar" aria-hidden="true" />
        <h3>{data.title}</h3>
        <p>{data.body}</p>
      </div>
    </div>
  );
};

/* ==========================================================================
   Section
   ========================================================================== */

const VideoShowcase = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from('.why__head > *', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      if (prefersReducedMotion) {
        gsap.set('.why__card', { x: 0, opacity: 1 });
        return;
      }

      // Desktop: scrubbed cascade tied to scroll position. Mobile cards are
      // stacked in normal flow (see CSS), so gate the scrub animation to
      // the layout it was actually designed for.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 981px)', () => {
        gsap.fromTo(
          '.why__card',
          { x: 120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: {
              trigger: '.why__grid',
              start: 'top 92%',
              end: 'top 28%',
              scrub: 0.9,
            },
          }
        );
      });

      mm.add('(max-width: 980px)', () => {
        gsap.fromTo(
          '.why__card',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.why__grid',
              start: 'top 88%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="why" id="watch" ref={sectionRef}>
      <div className="container">
        <div className="why__head">
          <span className="eyebrow">Sunic Technologies / Yard automation</span>
          <h2 className="why__title">
            <span className="why__title-line">AUTOMATION THAT RUNS</span>
            <span className="why__title-line why__title-line--accent">THE ENTIRE YARD</span>
          </h2>
          <p className="why__subtitle">
            From crane movement to container identification to slot allocation — our yard
            automation project handles the full cycle, with no manual tracking in between.
          </p>
        </div>

        <div className="why__grid">
          <WhyCard data={CARDS[0]} tileClass="a" />
          <WhyCard data={CARDS[1]} tileClass="b" />
          <WhyCard data={CARDS[2]} tileClass="c" />
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;