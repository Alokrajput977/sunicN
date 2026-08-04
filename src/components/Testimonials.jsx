import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const ROW_ONE = [
  {
    name: 'Ananya Rao',
    role: 'Ops Head, Vantage Port Terminal',
    quote:
      "We evaluated two other vendors before this and neither could commit to a timeline. Our yard management system went live in under ten weeks, fully integrated with our existing gate systems.",
  },
  {
    name: 'Rohit Malhotra',
    role: 'Plant Director, Malhotra Industries',
    quote:
      'The warehouse automation project cut our pick-pack cycle time in half within the first month. It wasn\u2019t just software, it was a complete rethink of how our floor operates.',
  },
  {
    name: 'Kavya Reddy',
    role: 'IT Manager, Reddy Freight Systems',
    quote:
      'Our rake planning used to be a spreadsheet three people fought over daily. Now the rail terminal solution handles allocation automatically and nobody argues about it anymore.',
  },
  {
    name: 'Arjun Nair',
    role: 'General Manager, Nair Container Yard',
    quote:
      'Gate-in and gate-out used to mean queues and paper. The gate automation project brought that down to seconds per truck with full OCR and e-seal verification.',
  },
  {
    name: 'Simran Kaur',
    role: 'Head of Operations, Kaur Logistics Park',
    quote:
      'What impressed us was how the project team stayed on through go-live and the two weeks after. Most vendors disappear the day the system turns on.',
  },
  {
    name: 'Vikram Iyer',
    role: 'CIO, Iyer Terminal Services',
    quote:
      'We asked for an automation project that would actually integrate with our legacy systems, not replace everything overnight. That\u2019s exactly what got delivered.',
  },
];

const ROW_TWO = [
  {
    name: 'Priya Sharma',
    role: 'Terminal Manager, Sharma Port Holdings',
    quote:
      'Container tracking used to mean radio calls and guesswork. The yard system now shows every box in real time and our turnaround times have dropped noticeably.',
  },
  {
    name: 'Aditya Verma',
    role: 'Director, Verma Logistics',
    quote:
      'We brought in Sunic for one automation project and ended up handing them our entire rail and gate integration. That says enough about how the first one went.',
  },
  {
    name: 'Neha Gupta',
    role: 'Operations Lead, Gupta Warehousing',
    quote:
      'Inventory used to be a manual count every evening. Now the system reconciles itself and flags discrepancies before they become a problem.',
  },
  {
    name: 'Karan Mehta',
    role: 'VP Operations, Mehta Rail Freight',
    quote:
      'Wagon tracking and intermodal handoff were our biggest bottleneck. The project team understood the problem faster than any vendor we\u2019d spoken to before.',
  },
  {
    name: 'Divya Menon',
    role: 'IT Head, Menon Container Services',
    quote:
      'Every automation vendor promises zero downtime during rollout. This was the first time we actually got it, migrated over a single weekend.',
  },
  {
    name: 'Suresh Pillai',
    role: 'Managing Director, Pillai Port Services',
    quote:
      'We wanted a partner who could scope, build and support the whole project end to end. That\u2019s what we got, and it shows in how fast our terminal now runs.',
  },
];

const AVATAR_COLORS = ['#4338CA', '#C77D2E', '#0F766E', '#B4443E', '#6D28D9', '#1E5A8A'];

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/* ----------------------------------------------------------------
   Card
---------------------------------------------------------------- */
const TestimonialCard = ({ item, colorIndex }) => (
  <blockquote className="tm-card">
    <div className="tm-card__head">
      <span
        className="tm-card__avatar"
        style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}
      >
        {initials(item.name)}
      </span>
      <div className="tm-card__id">
        <cite className="tm-card__name">{item.name}</cite>
        <span className="tm-card__role">{item.role}</span>
      </div>
    </div>
    <div className="tm-card__stars" aria-label="5 out of 5 stars">
      {'\u2605\u2605\u2605\u2605\u2605'}
    </div>
    <p className="tm-card__quote">{item.quote}</p>
  </blockquote>
);

/* ----------------------------------------------------------------
   One infinite marquee row — content is duplicated once so the
   loop can seam-lessly wrap via a 0% -> -50% (or reverse) tween.
---------------------------------------------------------------- */
const MarqueeRow = ({ items, trackRef, rowLabel }) => (
  <div className="tm-row" aria-label={rowLabel}>
    <div className="tm-row__track" ref={trackRef}>
      {[...items, ...items].map((item, i) => (
        <TestimonialCard item={item} colorIndex={i} key={`${item.name}-${i}`} />
      ))}
    </div>
  </div>
);

/* ----------------------------------------------------------------
   Section
---------------------------------------------------------------- */
const Testimonials = () => {
  const sectionRef = useRef(null);
  const wrap1Ref = useRef(null);
  const wrap2Ref = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const loopsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      // Start state: both rows sit above their slot, invisible.
      gsap.set([wrap1Ref.current, wrap2Ref.current], { y: -110, opacity: 0 });

      // The two infinite loops — built paused, released once the
      // entrance animation finishes.
      const loopRight = gsap.fromTo(
        track1Ref.current,
        { xPercent: -50 },
        { xPercent: 0, duration: 34, ease: 'none', repeat: -1, paused: true }
      );
      const loopLeft = gsap.fromTo(
        track2Ref.current,
        { xPercent: 0 },
        { xPercent: -50, duration: 38, ease: 'none', repeat: -1, paused: true }
      );
      loopsRef.current = [loopRight, loopLeft];

      if (prefersReducedMotion) {
        // Skip the drop-in flourish and the marquee motion entirely.
        gsap.set([wrap1Ref.current, wrap2Ref.current], { y: 0, opacity: 1 });
        return;
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
        onComplete: () => {
          loopRight.play();
          loopLeft.play();
        },
      })
        .to(wrap1Ref.current, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .to(
          wrap2Ref.current,
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.65'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const setHover = (paused) => {
    loopsRef.current.forEach((tween) => (paused ? tween.pause() : tween.play()));
  };

  return (
    <section className="tm" ref={sectionRef}>
      <div className="tm__head">
        <span className="tm__eyebrow">Client Stories</span>
        <h2 className="tm__title">
          What our <span className="tm__title-accent">partners</span> say
        </h2>
        <p className="tm__subtitle">
          Real feedback from ports, terminals and warehouses that run on Sunic Technologies projects.
        </p>
      </div>

      <div
        className="tm__rows"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="tm__row-wrap" ref={wrap1Ref}>
          <MarqueeRow items={ROW_ONE} trackRef={track1Ref} rowLabel="Client testimonials, row 1" />
        </div>
        <div className="tm__row-wrap" ref={wrap2Ref}>
          <MarqueeRow items={ROW_TWO} trackRef={track2Ref} rowLabel="Client testimonials, row 2" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;