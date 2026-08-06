import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   VIDEO — direct URL link. Swap for your own hosted gate / yard
   entry footage any time (Cloudinary, S3, your own CDN, etc.) —
   no other code changes needed.
   ================================================================ */
const yardVideo =
  'https://res.cloudinary.com/kajpumjn/video/upload/v1785918084/istockphoto-1279548706-640_adpp_is_online-video-cutter.com_chwlhb.mp4';

const STEPS = [
  {
    code: 'STEP 01',
    title: 'Plate scan',
    text: 'A camera reads the number plate on approach and matches it against today\u2019s gate bookings.',
  },
  {
    code: 'STEP 02',
    title: 'Driver & permit check',
    text: 'Driver ID and haulage permit are verified against the carrier\u2019s registered credentials.',
  },
  {
    code: 'STEP 03',
    title: 'Yard access granted',
    text: 'The barrier opens automatically and the driver is routed to their assigned dock.',
  },
];

const About = () => {
  const sectionRef = useRef(null);
  const graphicRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.about__graphic', '.about__copy', '.about__point'], {
          x: 0,
          xPercent: 0,
          opacity: 1,
        });
        return;
      }

      // Slow parallax drift on the graphic as the section scrolls through
      gsap.to(graphicRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Sequential reveal, tied directly to scroll position (repeatable
      // every time you scroll up/down): the video is hidden first, slides
      // in from the right, THEN — as scrolling continues — the text slides
      // out from behind it into place.
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 15%',
          scrub: 0.6,
        },
      });

      revealTl
        .fromTo(
          '.about__graphic',
          { xPercent: 130, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 1, ease: 'power2.out' }
        )
        .fromTo(
          '.about__copy',
          { x: -160, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
          '+=0.15'
        );

      gsap.from('.about__point', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about__points', start: 'top 85%' },
      });

      // Looping OCR "scan" — a glowing line sweeps down the frame and the
      // readout pulses, on a permanent loop.
      gsap.to('.about__scan-line', {
        top: '100%',
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.about__scan-status', {
        opacity: 0.35,
        duration: 3.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="container about__inner">
        <div className="about__graphic-wrap">
          <div className="about__graphic" ref={graphicRef}>
            <video className="about__video" src={yardVideo} autoPlay loop muted playsInline />

            <div className="about__scan-frame">
              <span className="about__scan-line" />
            </div>

            <div className="about__scan-readout">
              <span className="about__scan-plate">MH-04-AB-1234</span>
              <span className="about__scan-status">VERIFIED &#10003;</span>
            </div>
          </div>
        </div>

        <div className="about__copy">
          <span className="eyebrow">Gate automation / OCR entry</span>
          <h2 className="about__title">Every truck is verified before it enters</h2>
          <p className="about__text">
            As a truck approaches the gate, our OCR system reads the number
            plate and cross-checks it against the scheduled booking — no
            manual lookup, no paperwork at the barrier.
          </p>
          <p className="about__text">
            The driver&rsquo;s ID and haulage permit are verified in the same
            pass. Once cleared, the barrier lifts and the driver is routed
            to an assigned dock or yard slot on a live display — plate scan
            to yard access, in under eight seconds.
          </p>

          <div className="about__points">
            {STEPS.map((s) => (
              <div className="about__point" key={s.code}>
                <span className="about__point-code">{s.code}</span>
                <div className="about__point-body">
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;