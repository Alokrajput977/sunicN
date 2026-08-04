import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Clients.css';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   LOGOS — apne logo files public/logos/ me daalein aur neeche
   `logo: '/logos/oracle.png'` set kar dein. Jab tak logo nahi hai,
   card automatically ek styled wordmark render karega.
   ================================================================ */

const SECTORS = ['All', 'Networking', 'Storage & Data', 'Enterprise Software', 'AI & Cloud', 'Industrial'];

const CLIENTS = [
  {
    id: 'microsoft',
    name: 'Microsoft',
    sector: 'Enterprise Software',
    logo: null,
    years: '2019 — present',
    rating: 5.0,
    scope: ['Process automation', 'Cloud integration', 'Custom tooling'],
    summary:
      'A long-running engagement built around workflow automation and internal tooling, delivered to enterprise release standards.',
    detail:
      'Working alongside internal engineering teams, we delivered automation tooling that had to meet enterprise review, security and accessibility standards from day one. The bar for documentation and handover was the highest we have worked to, and it changed how we scope every project since.',
  },
  {
    id: 'oracle',
    name: 'Oracle',
    sector: 'Enterprise Software',
    logo: null,
    years: '2020 — present',
    rating: 5.0,
    scope: ['Database engineering', 'Data pipelines', 'Systems integration'],
    summary:
      'Database and integration work connecting enterprise data layers to operational systems running on the ground.',
    detail:
      'Our work here sits where enterprise data infrastructure meets live operations — pipelines, schema design, and the integration layer that lets terminal and warehouse systems read and write against enterprise-grade databases without becoming a bottleneck.',
  },
  {
    id: 'emc',
    name: 'EMC',
    sector: 'Storage & Data',
    logo: null,
    years: '2017 — 2023',
    rating: 4.9,
    scope: ['Storage systems', 'Data migration', 'Infrastructure'],
    summary:
      'Storage infrastructure and large-scale data migration work across multiple enterprise environments.',
    detail:
      'Migrations at this scale are unforgiving — there is no acceptable amount of data loss and no comfortable maintenance window. We built the tooling and the verification process that made those cutovers boring, which is the highest compliment a migration can receive.',
  },
  {
    id: 'veritas',
    name: 'VERITAS',
    sector: 'Storage & Data',
    logo: null,
    years: '2018 — present',
    rating: 4.9,
    scope: ['Backup systems', 'Recovery automation', 'Monitoring'],
    summary:
      'Backup and recovery automation, with monitoring built to catch failures before they become incidents.',
    detail:
      'The interesting problem in backup is not the backup — it is knowing, without checking, that a restore would actually work. We built the automated verification and alerting layer that answers that question continuously rather than during an incident.',
  },
  {
    id: 'legato',
    name: 'Legato',
    sector: 'Storage & Data',
    logo: null,
    years: '2017 — 2021',
    rating: 4.8,
    scope: ['Data protection', 'Automation scripts', 'Support tooling'],
    summary: 'Data protection tooling and automation around enterprise backup workflows.',
    detail:
      'A focused engagement automating the repetitive parts of enterprise data protection — scheduling, verification, and the reporting that operations teams previously assembled by hand every week.',
  },
  {
    id: '3com',
    name: '3COM',
    sector: 'Networking',
    logo: null,
    years: '2016 — 2020',
    rating: 4.8,
    scope: ['Network tooling', 'Device management', 'Diagnostics'],
    summary: 'Network management and diagnostic tooling for large multi-site device deployments.',
    detail:
      'One of our earliest enterprise engagements, and the one that taught us how differently networking teams think about failure. Everything we built had to degrade gracefully, because the tool cannot be the reason the network team loses visibility.',
  },
  {
    id: 'nortel',
    name: 'Nortel',
    sector: 'Networking',
    logo: null,
    years: '2016 — 2019',
    rating: 4.7,
    scope: ['Telecom systems', 'Integration', 'Reporting'],
    summary:
      'Telecom systems integration and operational reporting across distributed network infrastructure.',
    detail:
      'Integration work across telecom infrastructure where the data volumes were large and the tolerance for latency in reporting was small. It set the pattern for how we approach real-time operational dashboards today.',
  },
  {
    id: 'dlink',
    name: 'D-Link',
    sector: 'Networking',
    logo: null,
    years: '2019 — present',
    rating: 4.8,
    scope: ['Firmware tooling', 'Device automation', 'QA systems'],
    summary: 'Device automation and QA tooling supporting hardware release cycles.',
    detail:
      'Hardware release cycles do not wait for software. We built the test automation and device provisioning tooling that runs alongside their release process, so validation keeps pace with manufacturing rather than trailing it.',
  },
  {
    id: 'tyco',
    name: 'Tyco',
    sector: 'Industrial',
    logo: null,
    years: '2018 — 2024',
    rating: 4.9,
    scope: ['Security systems', 'Site automation', '3D site modeling'],
    summary:
      'Industrial security and site automation, including full 3D modeling of physical sites before deployment.',
    detail:
      'This is where our 3D modeling practice started. Planning camera placement and coverage across large physical sites in plan view kept producing surprises on installation day. Building a full 3D replica of the site first removed most of them, and it is now the first deliverable on every project we run.',
  },
  {
    id: 'ai-platform-1',
    name: 'AI Platform Client',
    sector: 'AI & Cloud',
    logo: null,
    years: '2024 — present',
    rating: 5.0,
    scope: ['ML pipelines', 'Vision systems', 'Model deployment'],
    summary: 'Computer-vision and model deployment work feeding directly into live automation systems.',
    detail:
      'Our AI work is not research — it is production vision systems that have to identify a container number correctly at 3am in monsoon glare. Model accuracy in a notebook is easy; accuracy on a live gate lane, every pass, is the actual problem, and it is the one we build for.',
  },
  {
    id: 'ai-platform-2',
    name: 'AI Automation Partner',
    sector: 'AI & Cloud',
    logo: null,
    years: '2025 — present',
    rating: 4.9,
    scope: ['AI project delivery', 'OCR systems', 'Edge inference'],
    summary:
      'End-to-end AI project delivery — OCR, edge inference, and integration into existing operational systems.',
    detail:
      'We sell AI projects the way we sell automation projects: scoped, delivered, integrated, and supported. Edge inference on site rather than round-tripping to a cloud, because a gate lane cannot wait on a network hop.',
  },
  {
    id: 'govt-psu',
    name: 'Government & PSU',
    sector: 'Industrial',
    logo: null,
    years: '2020 — present',
    rating: 4.9,
    scope: ['Terminal automation', 'Digitization', 'Long-term support'],
    summary:
      'Departmental digitization and terminal automation across public sector sites, with long-term support contracts.',
    detail:
      'Public sector engagements run on a longer clock — systems are expected to run unattended for a decade after handover. That discipline, and the repeat engagements that have come from it, is the part of our record we are proudest of.',
  },
];

const STATS = [
  { label: 'Enterprise clients', value: 40, suffix: '+' },
  { label: 'Average client rating', value: 4.9, suffix: '', decimal: true },
  { label: 'Client retention', value: 98, suffix: '%' },
  { label: 'Years in operation', value: 9, suffix: '+' },
];

/* ----------------------------------------------------------------
   Star rating — supports halves
---------------------------------------------------------------- */
const Rating = ({ value }) => {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    if (value >= i) return 'full';
    if (value >= i - 0.5) return 'half';
    return 'empty';
  });

  return (
    <span className="cl__rating" aria-label={`${value} out of 5`}>
      <span className="cl__stars" aria-hidden="true">
        {stars.map((state, i) => (
          <span className={`cl__star cl__star--${state}`} key={i}>
            ★
          </span>
        ))}
      </span>
      <span className="cl__rating-num">{value.toFixed(1)}</span>
    </span>
  );
};

/* ----------------------------------------------------------------
   Logo tile — real logo if provided, styled wordmark otherwise
---------------------------------------------------------------- */
const ClientLogo = ({ client }) => {
  const [failed, setFailed] = useState(false);

  if (client.logo && !failed) {
    return (
      <span className="cl__logo">
        <img src={client.logo} alt={client.name} onError={() => setFailed(true)} />
      </span>
    );
  }

  return (
    <span className="cl__logo cl__logo--mark">
      <span className="cl__logo-text">{client.name}</span>
    </span>
  );
};

/* ----------------------------------------------------------------
   Client card
---------------------------------------------------------------- */
const ClientCard = ({ client }) => {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const cardRef = useRef(null);

  const toggle = () => {
    const el = bodyRef.current;
    if (!el) return;

    if (!open) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out' }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
    }
    setOpen((o) => !o);
  };

  /* subtle 3D tilt, same technique as the rest of the site */
  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, { rotateY: px * 4, rotateX: -py * 4, duration: 0.5, ease: 'power2.out' });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
  };

  return (
    <article
      className={`cl__card ${open ? 'is-open' : ''}`}
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <ClientLogo client={client} />

      <div className="cl__card-head">
        <span className="cl__card-sector">{client.sector}</span>
        <h3 className="cl__card-name">{client.name}</h3>
        <span className="cl__card-years">{client.years}</span>
      </div>

      <p className="cl__card-summary">{client.summary}</p>

      <div className="cl__scope">
        {client.scope.map((s) => (
          <span className="cl__scope-tag" key={s}>
            {s}
          </span>
        ))}
      </div>

      <div className="cl__card-detail" ref={bodyRef} style={{ height: 0, opacity: 0 }}>
        <p>{client.detail}</p>
      </div>

      <div className="cl__card-foot">
        <Rating value={client.rating} />
        <button className="cl__more" onClick={toggle} type="button" aria-expanded={open}>
          {open ? 'Less' : 'More'} <span className="cl__more-icon">{open ? '↑' : '↓'}</span>
        </button>
      </div>
    </article>
  );
};

/* ----------------------------------------------------------------
   Page
---------------------------------------------------------------- */
const Clients = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const marqueeARef = useRef(null);
  const marqueeBRef = useRef(null);
  const tabListRef = useRef(null);
  const tabPillRef = useRef(null);
  const statValueRefs = useRef([]);
  const statsRef = useRef(null);
  const loopsRef = useRef([]);
  const [activeSector, setActiveSector] = useState('All');
  const isFirstRender = useRef(true);

  const filtered =
    activeSector === 'All' ? CLIENTS : CLIENTS.filter((c) => c.sector === activeSector);

  /* Entrance animations */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const heads = sectionRef.current.querySelectorAll('.cl__reveal');
        const cards = gridRef.current?.children;

        if (reduced) {
          gsap.set([heads, cards], { opacity: 1, y: 0, scale: 1 });
          statValueRefs.current.forEach((el, i) => {
            if (el)
              el.textContent = STATS[i].decimal
                ? STATS[i].value.toFixed(1)
                : STATS[i].value + STATS[i].suffix;
          });
          return;
        }

        /* Hero: word-by-word rise */
        gsap.fromTo(
          '.cl__title-word',
          { opacity: 0, y: 42, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.06,
            delay: 0.15,
          }
        );

        gsap.fromTo(
          heads,
          { opacity: 0, y: -26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
          }
        );

        gsap.fromTo(
          cards,
          { opacity: 0, y: 48, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.06,
            scrollTrigger: { trigger: gridRef.current, start: 'top 88%' },
          }
        );

        /* Stat cards + counters */
        gsap.fromTo(
          '.cl__stat',
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.09,
            scrollTrigger: { trigger: statsRef.current, start: 'top 88%' },
          }
        );

        STATS.forEach((stat, i) => {
          const el = statValueRefs.current[i];
          if (!el) return;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: stat.value,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
            onUpdate: () => {
              el.textContent = stat.decimal
                ? counter.val.toFixed(1)
                : Math.round(counter.val) + stat.suffix;
            },
          });
        });

        /* Two marquee rows, opposite directions */
        const loopA = gsap.fromTo(
          marqueeARef.current,
          { xPercent: 0 },
          { xPercent: -50, duration: 46, ease: 'none', repeat: -1 }
        );
        const loopB = gsap.fromTo(
          marqueeBRef.current,
          { xPercent: -50 },
          { xPercent: 0, duration: 54, ease: 'none', repeat: -1 }
        );
        loopsRef.current = [loopA, loopB];
      }, sectionRef);

      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    };

    const fontsReady =
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const pageLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener('load', r, { once: true }));

    Promise.all([fontsReady, pageLoaded]).then(build);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const setMarqueeHover = (paused) => {
    loopsRef.current.forEach((t) => (paused ? t.pause() : t.play()));
  };

  /* Re-animate grid on filter change */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = gridRef.current?.children;
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.05 }
    );
    ScrollTrigger.refresh();
  }, [activeSector]);

  /* Sliding underline */
  const movePill = (btn, animate = true) => {
    const list = tabListRef.current;
    const pill = tabPillRef.current;
    if (!list || !pill || !btn) return;
    const listBox = list.getBoundingClientRect();
    const itemBox = btn.getBoundingClientRect();
    gsap.to(pill, {
      x: itemBox.left - listBox.left,
      width: itemBox.width,
      duration: animate ? 0.45 : 0,
      ease: 'power3.inOut',
    });
  };

  useEffect(() => {
    const position = () => {
      const btn = tabListRef.current?.querySelector(`[data-sector="${activeSector}"]`);
      if (btn) movePill(btn, false);
    };
    const fontsReady =
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(position);
    window.addEventListener('resize', position);
    return () => window.removeEventListener('resize', position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTab = (sector, e) => {
    setActiveSector(sector);
    movePill(e.currentTarget, true);
  };

  const titleWords = 'Trusted by enterprises, operators, and government'.split(' ');
  const marqueeNames = CLIENTS.map((c) => c.name);

  return (
    <div className="cl" ref={sectionRef}>
      {/* ---------- Hero ---------- */}
      <section className="cl__hero">
        <div className="cl__container cl__hero-inner">
          <span className="cl__eyebrow">Clients / Who we build for</span>
          <h1 className="cl__title">
            {titleWords.map((word, i) => (
              <span className="cl__title-word" key={i}>
                {word}
              </span>
            ))}
          </h1>
          <p className="cl__subtitle">
            Over nine years we have delivered automation, AI and infrastructure projects for
            global technology companies, industrial operators and public sector departments —
            and most of them are still with us.
          </p>
        </div>
      </section>

      {/* ---------- Full-bleed logo marquee, two rows ---------- */}
      <section
        className="cl__marquee-band"
        onMouseEnter={() => setMarqueeHover(true)}
        onMouseLeave={() => setMarqueeHover(false)}
      >
        <div className="cl__marquee-label">
          <span>Nine years / Forty-plus engagements</span>
        </div>

        <div className="cl__marquee">
          <div className="cl__marquee-track" ref={marqueeARef}>
            {[...marqueeNames, ...marqueeNames].map((name, i) => (
              <span className="cl__marquee-item" key={`a-${i}`}>
                {name}
                <span className="cl__marquee-dot" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>

        <div className="cl__marquee cl__marquee--alt">
          <div className="cl__marquee-track" ref={marqueeBRef}>
            {[...marqueeNames, ...marqueeNames].reverse().map((name, i) => (
              <span className="cl__marquee-item" key={`b-${i}`}>
                {name}
                <span className="cl__marquee-dot" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="cl__stats-band">
        <div className="cl__container">
          <div className="cl__stats" ref={statsRef}>
            {STATS.map((stat, i) => (
              <div className="cl__stat" key={stat.label}>
                <span className="cl__stat-value" ref={(el) => (statValueRefs.current[i] = el)}>
                  0{stat.suffix}
                </span>
                <span className="cl__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Client grid ---------- */}
      <section className="cl__section">
        <div className="cl__container">
          <div className="cl__grid-head">
            <span className="cl__eyebrow cl__reveal">Our clients</span>
            <h2 className="cl__section-title cl__reveal">Nine years of engagements</h2>
            <p className="cl__grid-sub cl__reveal">
              Every rating below reflects sustained engagements, not one-off builds — the work
              that kept going after the first project shipped.
            </p>
          </div>

          <div className="cl__tabs-wrap cl__reveal">
            <div className="cl__tabs" ref={tabListRef}>
              <span className="cl__pill" ref={tabPillRef} aria-hidden="true" />
              {SECTORS.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  data-sector={sector}
                  className={`cl__tab ${activeSector === sector ? 'is-active' : ''}`}
                  onClick={(e) => handleTab(sector, e)}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div className="cl__grid" ref={gridRef}>
            {filtered.map((client) => (
              <ClientCard client={client} key={client.id} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing note ---------- */}
      <section className="cl__section cl__section--note">
        <div className="cl__container">
          <div className="cl__note cl__reveal">
            <span className="cl__eyebrow">Why they stay</span>
            <h2 className="cl__section-title">
              We measure a project by whether it still runs two years later
            </h2>
            <p>
              Almost every client on this page came to us for one project and stayed for the
              next. That is the number we actually track. Automation and AI systems are easy to
              demonstrate and hard to keep running unattended — and the second part is the work
              we build our practice around.
            </p>
            <ul>
              <li>Sustained engagements, not one-off builds</li>
              <li>Long-term maintenance and support contracts</li>
              <li>Integration with existing systems, not wholesale replacement</li>
              <li>Handover that assumes we will not be in the room</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Clients;