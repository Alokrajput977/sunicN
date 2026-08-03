import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const ROW_ONE = [
  {
    name: 'Ananya Rao',
    role: "Ananya's Wellness Studio",
    quote:
      "We tried two other agencies before this and nothing shipped. Within three weeks our full site was live, booking included. Didn't expect that turnaround.",
  },
  {
    name: 'Rohit Malhotra',
    role: 'Malhotra Automobiles',
    quote:
      'Customers now tell us they found us on Google and the site is what convinced them to walk in. Before, it just wasn\u2019t part of the conversation.',
  },
  {
    name: 'Kavya Reddy',
    role: 'Cafe Bloom',
    quote:
      'Table reservations used to mean juggling calls all evening. Now guests book straight from the site and we just show up ready.',
  },
  {
    name: 'Arjun Nair',
    role: 'Nair & Associates',
    quote:
      'Enquiries used to come in as "what do you charge, roughly?" Now they come in with real case details attached. Changes how every first call goes.',
  },
  {
    name: 'Simran Kaur',
    role: 'Kaur Fitness Hub',
    quote:
      'Trial sign-ups moved online and doubled in the first month. We stopped losing people to a slow WhatsApp reply.',
  },
  {
    name: 'Vikram Iyer',
    role: 'Iyer Consulting',
    quote:
      'The new site finally looks like the work we actually do. That alone has changed how prospects treat the first meeting.',
  },
];

const ROW_TWO = [
  {
    name: 'Priya Sharma',
    role: 'Sharma Dental Clinic',
    quote:
      'Appointments used to run through a diary and missed calls. Patients book their own slot now and no-shows have dropped noticeably.',
  },
  {
    name: 'Aditya Verma',
    role: 'Verma Logistics',
    quote:
      'Our old site listed a phone number and nothing else. Now leads land with actual shipment volumes attached, not just "send rates."',
  },
  {
    name: 'Neha Gupta',
    role: 'Gupta Interiors',
    quote:
      'People used to ask to see a portfolio over email. Now they\u2019ve already browsed it before they call, so the first conversation is much further along.',
  },
  {
    name: 'Karan Mehta',
    role: 'Mehta Real Estate',
    quote:
      'Listings update themselves and buyers filter by budget on their own. That used to be a full-time job on the phone.',
  },
  {
    name: 'Divya Menon',
    role: 'Menon Yoga Studio',
    quote:
      'Class schedules kept changing and nobody could keep track over text. The site now stays current on its own and students just check it.',
  },
  {
    name: 'Suresh Pillai',
    role: 'Pillai Traders',
    quote:
      'We wanted something we wouldn\u2019t be embarrassed to send a new buyer. That\u2019s exactly what we got, and it shows in how fast deals now close.',
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
          What our <span className="tm__title-accent">clients</span> say
        </h2>
        <p className="tm__subtitle">
          Real feedback from businesses across India that put their site to work.
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