import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VideoShowcase.css';

import fleetVideo from '../video/two.mp4';
import portVideo from '../video/port.mp4';
import warehouseVideo from '../video/four.mp4';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: 'a',
    accent: 'teal',
    src: fleetVideo,
    title: 'Book freight in one move',
    body: 'Request a quote from a single form — no separate calls per mode. We match ocean, air, rail or road to your cargo automatically.',
  },
  {
    id: 'b',
    accent: 'amber',
    src: portVideo,
    title: 'Every leg, mapped and tracked',
    body: 'See live location, ETA and exceptions the moment they happen — no more calling for updates.',
  },
  {
    id: 'c',
    accent: 'violet',
    src: warehouseVideo,
    title: 'Full visibility, every shipment',
    body: 'One dashboard for the whole network — consistent tracking data across every carrier, mode and region.',
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
    const ctx = gsap.context(() => {
      // Heading — simple fade/rise, plays on the way down, reverses on the way up
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

      // Cards — motion is scrubbed directly to scroll position (not a fixed-
      // duration triggered tween), so it tracks the scrollbar 1:1 with a
      // touch of smoothing lag instead of feeling like it's "catching up".
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="why" id="watch" ref={sectionRef}>
      <div className="container">
        <div className="why__head">
          <span className="eyebrow">Why Vectra / The difference</span>
          <h2 className="why__title">
            <span className="why__title-line">WHY SHIP WITH</span>
            <span className="why__title-line why__title-line--accent">VECTRA'S NETWORK?</span>
          </h2>
          <p className="why__subtitle">
            Most carriers move boxes. Vectra moves freight with visibility,
            speed, and a workflow built for real operations.
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