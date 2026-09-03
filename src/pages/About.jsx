import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------
   Content — Sunic Technologies
   Placeholder figures/name below — swap in your real numbers and
   founder details before shipping.
---------------------------------------------------------------- */
const STATS = [
  { label: 'Years in operation', value: 9, suffix: '+' },
  { label: 'Automation projects delivered', value: 60, suffix: '+' },
  { label: 'Government projects delivered', value: 15, suffix: '+' },
  { label: 'Client retention', value: 98, suffix: '%' },
];

const JOURNEY = [
  {
    year: '2016',
    title: 'Founded in Gurugram',
    desc: 'Sunic Technologies started as a small team building custom software for local businesses across Delhi NCR.',
  },
  {
    year: '2018',
    title: 'First automation project',
    desc: 'Delivered our first large-scale workflow automation engagement — replacing manual spreadsheets with a real system for a manufacturing client.',
  },
  {
    year: '2020',
    title: 'Entered the public sector',
    desc: 'Began implementing digitization projects for government departments, building the compliance and security discipline that public sector work demands.',
  },
  {
    year: '2022',
    title: 'Launched database & hosting services',
    desc: 'Started offering dedicated database and hosting space for clients who needed reliable, always-on infrastructure instead of piecing it together themselves.',
  },
  {
    year: '2024',
    title: 'Crossed 40 clients',
    desc: 'Grew to serve enterprises and government departments across banking, retail, and public sector work — most of whom stay on year after year.',
  },
  {
    year: 'Today',
    title: 'Software, automation, and infrastructure',
    desc: 'We continue to build and sell software, run automation projects, and provide the database and hosting space that keeps it all running.',
  },
];

const SERVICES = [
  {
    title: 'Automation Projects',
    desc: 'We build and sell end-to-end automation systems — yard, gate, warehouse and rail operations that run on their own instead of on manual coordination.',
  },
  {
    title: '3D Modeling & Digital Twins',
    desc: 'Full 3D models of sites, yards and facilities — a working digital replica of the real area, used for planning, simulation and live operational monitoring.',
  },
  {
    title: 'Custom Software Development',
    desc: 'Web and enterprise applications built around how your teams actually work, not the other way round.',
  },
  {
    title: 'Government & Public Sector Solutions',
    desc: 'Departmental digitization, citizen-facing portals and large automation deployments built to public sector security and compliance standards.',
  },
];

const PUBLIC_SECTOR_POINTS = [
  'Large-scale automation deployments across departmental and terminal sites',
  '3D site modeling and digital twins for planning, approvals and monitoring',
  'Data security aligned with public sector compliance requirements',
  'Long-term maintenance and support contracts, not one-off builds',
];

const About = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const statValueRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const revealTargets = sectionRef.current.querySelectorAll('.ab__reveal');

        if (prefersReducedMotion) {
          gsap.set(revealTargets, { opacity: 1, y: 0, x: 0 });
          statValueRefs.current.forEach((el, i) => {
            if (el) el.textContent = STATS[i].value + STATS[i].suffix;
          });
          return;
        }

        /* Standard site-wide entrance: drop in from above, stay
           visible on continued scroll-down, reverse only if you
           scroll back up past the top of the section. */
        gsap.fromTo(
          revealTargets,
          { opacity: 0, y: -28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none play reverse',
            },
          }
        );

        /* Journey timeline: each entry slides in from whichever
           side it sits on (left entries from the left, right
           entries from the right), reversible with scroll like
           everything else on the page. */
        gsap.utils.toArray('.ab__tl-item').forEach((item) => {
          const fromX = item.dataset.side === 'right' ? 36 : -36;
          gsap.fromTo(
            item,
            { opacity: 0, x: fromX },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 55%',
                toggleActions: 'play none play reverse',
              },
            }
          );
        });

        /* Stat counters: count up once when they scroll into view.
           Deliberately one-shot, not reversible — re-counting from
           zero every time you scroll past reads as a glitch. */
        STATS.forEach((stat, i) => {
          const el = statValueRefs.current[i];
          if (!el) return;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: stat.value,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              el.textContent = Math.round(counter.val) + stat.suffix;
            },
          });
        });
      }, sectionRef);

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
    <div className="ab" ref={sectionRef}>
      {/* ---------- Hero ---------- */}
      <section className="ab__section">
        <div className="container ab__hero">
          <span className="ab__badge ab__reveal">🇮🇳 Proudly built in India</span>
          <span className="ab__eyebrow ab__reveal">About Sunic Technologies</span>
          <h1 className="ab__title ab__reveal">
            Automation, software, and <span style={{ color: '#5b4cf0' }}>3D built</span>  for real operations
          </h1>
          <p className="ab__subtitle ab__reveal">
            We're a Gurugram-based IT company that builds and sells automation projects,
            3D site models, and enterprise software — for private operators and government
            departments alike.
          </p>
        </div>

        {/* ---------- Story ---------- */}
        <div className="container-wide ab__story">
          <div className="ab__story-text">
            <p className="ab__reveal">
              Sunic Technologies is an IT company built around a simple premise: most organizations
              don't need more software, they need systems that actually run. We design, build and
              sell automation projects — yard, gate, warehouse and terminal operations — along with
              full 3D models of the sites they run on, so teams can see and plan the real area
              before a single change is made on the ground.
            </p>
            <p className="ab__reveal">
              A large part of our work is with the public sector, and it's the work we're proudest
              of. We've delivered a significant number of government projects — departmental
              automation, digitization and 3D site modeling — and the response has been consistently
              strong, with departments returning to us for the next phase long after the first one
              went live.
            </p>
          </div>

          <div className="ab__story-art ab__reveal">
            {/* Drop your own image in here — replace the src below. */}
            <img
              className="ab__story-image"
              src="https://res.cloudinary.com/kajpumjn/image/upload/v1788180246/WhatsApp_Image_2026-08-31_at_17.10.49_sbur0d.jpg"
              alt="Sunic Technologies"
            />
          </div>
        </div>
      </section>

      {/* ---------- Stats (full-bleed tinted band) ---------- */}
      <section className="ab__section ab__band">
        <div className="container-wide ab__stats" ref={statsRef}>
          {STATS.map((stat, i) => (
            <div className="ab__stat ab__reveal" key={stat.label}>
              <span className="ab__stat-value" ref={(el) => (statValueRefs.current[i] = el)}>
                0{stat.suffix}
              </span>
              <span className="ab__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Journey timeline ---------- */}
      <section className="ab__section">
        <div className="container ab__journey-head">
          <span className="ab__eyebrow ab__reveal">Our journey</span>
          <h2 className="ab__section-title ab__reveal">From a two-person team to 40+ clients</h2>
          <p className="ab__journey-sub ab__reveal">
            Software, automation, and the infrastructure to run it all — here's how we got here.
          </p>
        </div>

        <div className="container-wide ab__timeline">
          <span className="ab__tl-line" aria-hidden="true" />
          {JOURNEY.map((item, i) => (
            <div
              className="ab__tl-item"
              data-side={i % 2 === 0 ? 'left' : 'right'}
              key={item.year}
            >
              <div className="ab__tl-card">
                <span className="ab__tl-year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <span className="ab__tl-dot" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- What we do ---------- */}
      <section className="ab__section ab__band">
        <div className="container ab__services-head">
          <span className="ab__eyebrow ab__reveal">What we do</span>
          <h2 className="ab__section-title ab__reveal">Four ways we work with clients</h2>
        </div>

        <div className="container-wide ab__services">
          {SERVICES.map((s) => (
            <div className="ab__service ab__reveal" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Public sector focus ---------- */}
      <section className="ab__section">
        <div className="container-wide ab__public">
          <div className="ab__public-card ab__reveal">
            <span className="ab__eyebrow">Public sector</span>
            <h2 className="ab__section-title">Trusted with government projects, again and again</h2>
            <p>
              Government engagements come with a different bar — longer timelines, stricter
              compliance, and systems that need to keep working long after the initial contract
              ends. We've delivered a large number of these projects, and the response has been
              consistently strong: departments come back to us for the next site, the next phase,
              the next automation rollout.
            </p>
            <ul>
              {PUBLIC_SECTOR_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Founder quote ---------- */}
      <section className="ab__section">
        <div className="container ab__quote-wrap">
          <blockquote className="ab__quote ab__reveal">
            <span className="ab__quote-mark" aria-hidden="true">
              "
            </span>
            <p>
              We don't measure an automation project by the demo — we measure it by whether it's
              still running, unattended, two years later. That's a different discipline than most
              software companies operate under, and it's the one we've built Sunic around.
            </p>
            <footer>
              <span className="ab__quote-name">Manmohan Rana Singh</span>
              <span className="ab__quote-role">Founder &amp; CEO, Sunic Technologies</span>
            </footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
};

export default About;