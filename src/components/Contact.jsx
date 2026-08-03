import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const cardRef = useRef(null);
  const successRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  /* ---------------- Scroll-linked entrance ----------------
     Copy (eyebrow / title / text) drops down from above; the card
     slides in from the left to its resting position. It's scrubbed
     to the scrollbar itself — plays forward as you scroll down
     through the band, reverses as you scroll back up, every time.

     The fix for "only works after refresh": instead of creating the
     ScrollTrigger immediately and refreshing it later, we simply do
     NOT create it until the browser tells us fonts + the full page
     have actually finished loading. That way it measures the real,
     final layout on the very first try instead of measuring a wrong
     layout and trying to patch it afterwards (which can leave a
     scrub-based trigger stuck at a stale progress value until the
     next scroll event happens to fire). */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const copyEls = copyRef.current.children;

        if (prefersReducedMotion) {
          gsap.set(copyEls, { opacity: 1, y: 0 });
          gsap.set(cardRef.current, { opacity: 1, x: 0 });
          return;
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 88%',
              end: 'top 38%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            copyEls,
            { opacity: 0, y: -48 },
            { opacity: 1, y: 0, ease: 'power2.out', stagger: 0.15, duration: 1 }
          )
          .fromTo(
            cardRef.current,
            { opacity: 0, x: -130 },
            { opacity: 1, x: 0, ease: 'power2.out', duration: 1 },
            '-=0.5'
          );
      }, sectionRef);

      // One more measure on the next two frames, after layout has
      // fully painted with the final fonts in place.
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

  /* ---------------- Success state pop-in ---------------- */
  useEffect(() => {
    if (submitted && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 14, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }
      );
    }
  }, [submitted]);

  /* ---------------- 3D tilt on hover ---------------- */
  const handleMove = (e) => {
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, { rotateY: px * 6, rotateX: -py * 6, duration: 0.5, ease: 'power2.out' });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="container contact__inner">
        <div className="contact__copy" ref={copyRef}>
          <span className="contact__eyebrow">Get started / Waybill request</span>
          <h2 className="contact__title">Ready to move your next shipment?</h2>
          <p className="contact__text">
            Tell us the route and cargo type — our team replies with a rate and
            transit estimate within one business day.
          </p>
        </div>

        <form
          className="contact__card"
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onSubmit={handleSubmit}
        >
          <div className="contact__card-glow" aria-hidden="true" />
          <div className="contact__card-tag">WAYBILL / NEW REQUEST</div>

          {submitted ? (
            <div className="contact__success" ref={successRef}>
              <span className="contact__success-mark">✓</span>
              <p>Request received. Our team will reach out shortly.</p>
            </div>
          ) : (
            <>
              <div className="contact__row">
                <label>
                  <span>Full name</span>
                  <input type="text" name="name" placeholder="Jordan Lee" required />
                </label>
                <label>
                  <span>Company</span>
                  <input type="text" name="company" placeholder="Norwell Retail" />
                </label>
              </div>

              <div className="contact__row">
                <label>
                  <span>Origin</span>
                  <input type="text" name="origin" placeholder="Mumbai, IN" required />
                </label>
                <label>
                  <span>Destination</span>
                  <input type="text" name="destination" placeholder="Rotterdam, NL" required />
                </label>
              </div>

              <label>
                <span>Cargo details</span>
                <textarea name="details" rows="3" placeholder="Cargo type, weight, preferred mode..." />
              </label>

              <button type="submit" className="btn btn--primary contact__submit">
                Request a quote
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;