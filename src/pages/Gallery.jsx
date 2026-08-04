import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

/* ================================================================
   MEDIA CONFIG — sab kuch yahin se swap karein.
   ================================================================ */
import yardVideo from '../video/yard.mp4';
import portVideo from '../video/port.mp4';
import twoVideo from '../video/two.mp4';

const IMG = {
  gate: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1400&q=80',
  warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1400&q=80',
  rail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1400&q=80',
  team: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80',
  meeting: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&q=80',
  control: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1400&q=80',
};

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ['All', 'Photos', 'Videos', 'Blog'];

/* ----------------------------------------------------------------
   Gallery items
   kind: 'photo' | 'video' | 'blog'
   size: 'wide' | 'tall' | 'normal'
---------------------------------------------------------------- */
const ITEMS = [
  {
    id: 'concor-leadership',
    kind: 'blog',
    size: 'wide',
    tag: 'Company update',
    title: 'Our CEO meets CONCOR leadership on the next phase of terminal automation',
    caption:
      'A working session on where automation goes next across rail-linked terminals — gate throughput, yard visibility, and what a shared digital model of a terminal should look like.',
    body: `Our founder and CEO, Rohan Malhotra, spent this month in a series of working sessions with senior officials at Container Corporation of India, reviewing the next phase of terminal automation across their rail-linked network.

These were not pitch meetings. They were operational reviews, and they went the way the useful ones do — straight into the specifics. Where does gate throughput actually break down on a heavy day? Which yard blocks lose visibility during a rake changeover? What does a control room supervisor need on screen at 3am that no dashboard currently gives them?

**What came out of it**

Three themes ran through every conversation.

The first was gate throughput. Automated gate lanes with OCR and e-seal verification have taken per-truck processing from minutes to seconds at the sites where they are live. The question now is less about whether the technology works and more about how quickly the remaining lanes can be brought to the same standard without disrupting live operations during the transition.

The second was yard visibility as a single, shared picture. Individual terminals have strong systems. What is harder — and what came up repeatedly — is a consistent operational view across sites, so that a planner is not reconciling four different definitions of the same container movement.

The third was the digital model. We have argued for a while that every terminal project should start with a full 3D replica of the site, and that the model should stay live after commissioning rather than being retired as a presentation asset. That view was met with more agreement than we expected, and a fair amount of pressure to prove it at scale rather than on a single yard.

**Where this goes**

We came away with a clearer scope for the next phase and a longer list of hard questions than we walked in with, which is usually the sign of a good engagement.

Public sector work has always been the part of our business we are proudest of. It runs on a different clock — longer timelines, stricter compliance, and an expectation that whatever gets installed will still be running, unattended, a decade from now. That discipline has made us a better engineering company across all of our work, government or otherwise.

More on the specifics as the next phase is scoped.`,
    readTime: '6 min read',
    date: 'Jul 2026',
    src: IMG.meeting,
  },
  {
    id: 'automation-update',
    kind: 'blog',
    size: 'normal',
    tag: 'Project update',
    title: 'Automation rollout update — Q2 2026',
    caption:
      'Where our yard, gate, warehouse and rail deployments stand this quarter, and what we learned from each.',
    body: `A short quarterly note on where our automation deployments stand, what shipped, and what we got wrong.

**Gate automation — four new lanes live**

Four additional automated gate lanes went into production this quarter, taking OCR-based container and wagon identification to full coverage at two sites. Average gate-in processing is now measured in seconds rather than minutes, and manual data entry at the gate has effectively disappeared from the workflow.

The unexpected work was in the edge cases. Damaged container markings, non-standard wagon plates, and heavy monsoon glare on the camera housing accounted for more engineering time than the core recognition pipeline did. That ratio is normal, and we now plan for it explicitly rather than treating it as overrun.

**Yard management — slot allocation running unattended**

The yard system at our largest live site has been allocating slots and directing crane movements without manual coordination for a full quarter. The number we care about is not uptime — it is how often an operator overrides the system. That figure has fallen steadily since go-live, which tells us the allocation logic is matching how the yard actually works rather than how the plan assumed it would.

**Warehouse — inventory reconciliation automated**

The bonded warehouse rollout replaced a nightly manual count with continuous reconciliation. Discrepancies are now flagged as they occur instead of surfacing the next morning. The floor team's feedback was blunt and useful: the system was right, but it was flagging too much. We have since tuned the thresholds down considerably.

**Rail — rake planning in production**

Rake planning moved off spreadsheets and into the system this quarter. Wagon tracking and intermodal handoff are now on the same data as the rest of the yard, which removed an entire class of reconciliation work that three people used to share.

**What we are carrying into Q3**

Integration with legacy systems remains the slowest part of every deployment, and it is where we consistently underestimate. We are changing how we scope it — treating legacy integration as its own workstream with its own timeline rather than as a phase of the main build.`,
    readTime: '5 min read',
    date: 'Jun 2026',
    src: IMG.control,
  },
  {
    id: 'yard-crane',
    kind: 'video',
    size: 'normal',
    tag: 'Yard automation',
    title: 'Automated rail crane cycle',
    caption:
      'A rail-mounted gantry running an unmanned lift-and-place cycle at a live terminal. The system determines the target slot from current yard state; the crane executes the movement without operator input at any point in the cycle. Footage recorded during a standard shift, not a staged demonstration.',
    src: yardVideo,
    date: 'Mar 2026',
  },
  {
    id: 'gate-ocr',
    kind: 'photo',
    size: 'normal',
    tag: 'Gate automation',
    title: 'OCR gate lane, commissioned',
    caption:
      'An automated gate lane on its first week in production. Container numbers, wagon IDs and e-seal data are captured as the vehicle moves through, matched against the booking, and logged — no paperwork, no manual entry, no stop beyond the read itself.',
    src: IMG.gate,
    date: 'Feb 2026',
  },
  {
    id: 'digital-twin',
    kind: 'blog',
    size: 'normal',
    tag: 'Engineering',
    title: 'Why every yard project should start with a 3D model',
    caption:
      'Before a single sensor goes up, we build a full 3D replica of the site. Here is what that catches — and what it saves.',
    body: `Most automation projects fail at the same point: the plan looked fine on paper, then the site turned out to be three metres narrower than the drawing said.

We build a full 3D model of the area before anything is installed. Crane reach, stack heights, truck turning radii, camera sight lines — all of it gets tested against a replica of the real site instead of against an assumption.

**What the model catches**

That surfaces the expensive problems early. A camera position that looks fine in plan view but stares straight into afternoon sun for two hours a day. A stacking configuration that works until a reefer row goes in and blocks a sight line. A turning circle that fits the drawing but not an actual forty-foot trailer with a tired driver at 3am.

None of these are exotic failures. They are ordinary, and they are all far cheaper to find in a model than in concrete. The cost of moving a camera mount in software is nothing. The cost of moving it after it has been installed on a gantry at a live terminal is a shift of lost throughput and a crew with a lift.

**The model does not get thrown away**

This is the part most people find surprising. The 3D model is not a pre-sales asset that gets archived after commissioning. It becomes the operational view: the same geometry that planned the site is what operators watch it run on.

When the yard changes — and it always changes, because operations always change — the model changes with it, and the automation stays aligned to what is actually on the ground rather than to what was true on the day of handover. A model that diverges from the site within six months is worse than no model at all, because people keep trusting it.

**What it costs**

A few weeks up front, on every project, before anything visible gets built. That is a genuinely difficult conversation to have with a client who wants to see hardware going up.

We have had that conversation on every site where we have done it, and it has saved months every time. We now treat the 3D model as the first deliverable of a project rather than an optional extra, and we scope it that way from the beginning.`,
    readTime: '6 min read',
    date: 'Feb 2026',
  },
  {
    id: 'port-ops',
    kind: 'video',
    size: 'normal',
    tag: 'Terminal ops',
    title: 'Container and wagon reading',
    caption:
      'Live OCR matching containers to wagons as a rake moves through the yard. Each box is identified, paired to its wagon position, and reconciled against the manifest in the same pass — work that previously meant radio calls and a clipboard.',
    src: portVideo,
    date: 'Jan 2026',
  },
  {
    id: 'warehouse-floor',
    kind: 'photo',
    size: 'tall',
    tag: 'Warehouse',
    title: 'Bonded warehouse, post-rollout',
    caption:
      'The pick-pack-ship floor after our inventory automation went live. Continuous reconciliation replaced the nightly manual count, so discrepancies surface as they happen rather than the following morning.',
    src: IMG.warehouse,
    date: 'Jan 2026',
  },
  {
    id: 'govt-handover',
    kind: 'blog',
    size: 'normal',
    tag: 'Public sector',
    title: 'What government projects actually demand',
    caption:
      'Longer timelines, stricter compliance, and systems that must still run years after handover.',
    body: `Public sector work runs on a different clock. A private client wants it live this quarter. A government department wants it live this quarter and still running, unattended, in 2036.

That changes what you build.

**Documentation is a deliverable, not an afterthought**

On a commercial project, documentation is what you write when the feature is done. On a government project it is part of the feature. If the only person who understands a subsystem is the engineer who built it, the system has a single point of failure with a notice period.

**Access control comes before features**

Security gets designed at the start rather than reviewed at the end. That is slower and it is also the only way it actually holds. A permissions model retrofitted onto a finished system is a permissions model with holes in it, and public sector audits find those holes.

**Every dependency gets a question attached**

Who maintains this if we are not here? For each library, each service, each piece of hardware. A dependency that is convenient today and unsupported in four years is a liability we are handing to someone else.

**Handover is not a demo**

A demonstration that works with the project team standing behind it is not a handover. We run every government system through a period where our engineers watch and the department operates, not the other way round. If they cannot run it without us in the room, it is not finished — regardless of what the contract says about completion.

**Why we keep doing it**

It is slower work. There are more meetings, more sign-offs, and more documentation than any private engagement asks for.

It is also the work we are proudest of, and the reason departments come back to us for the next site, the next phase, the next rollout. The discipline it forces has made us better at the commercial work too.`,
    readTime: '5 min read',
    date: 'Dec 2025',
  },
  {
    id: 'rail-yard-night',
    kind: 'photo',
    size: 'normal',
    tag: 'Rail terminal',
    title: 'Night shift, rail siding',
    caption:
      'The rake planning system handling allocation through a full night cycle. Wagon tracking and intermodal handoff now run on the same data as the rest of the yard.',
    src: IMG.rail,
    date: 'Dec 2025',
  },
  {
    id: 'fleet-move',
    kind: 'video',
    size: 'normal',
    tag: 'Yard automation',
    title: 'Slot allocation in motion',
    caption:
      'The system picks the slot from current yard state and the crane executes it. What matters here is not the movement itself but how rarely an operator needs to override the choice.',
    src: twoVideo,
    date: 'Nov 2025',
  },
  {
    id: 'team-note',
    kind: 'photo',
    size: 'normal',
    tag: 'Inside Sunic',
    title: 'Commissioning week, Gurugram',
    caption:
      'The engineering team through the final week before a terminal go-live — the stretch where the 3D model, the integration work and the hardware all have to agree with each other.',
    src: IMG.team,
    date: 'Nov 2025',
  },
];

/* ----------------------------------------------------------------
   Renders **bold** segments inside blog paragraphs as headings
---------------------------------------------------------------- */
const Prose = ({ body }) =>
  body.split('\n\n').map((block, i) => {
    const heading = block.match(/^\*\*(.+)\*\*$/);
    if (heading) {
      return (
        <h4 className="gx__prose-head" key={i}>
          {heading[1]}
        </h4>
      );
    }
    return <p key={i}>{block}</p>;
  });

/* ----------------------------------------------------------------
   Media with graceful fallback
---------------------------------------------------------------- */
const CardMedia = ({ item }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !item.src) {
    return (
      <span className="gl__card-fallback">
        <span className="gl__card-fallback-mark" aria-hidden="true">
          ▦
        </span>
        <span className="gl__card-fallback-text">{item.tag}</span>
      </span>
    );
  }

  if (item.kind === 'photo') {
    return <img src={item.src} alt={item.title} loading="lazy" onError={() => setFailed(true)} />;
  }

  return (
    <video
      src={item.src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onError={() => setFailed(true)}
    />
  );
};

/* ----------------------------------------------------------------
   Lightbox — media is capped so the text area always has room,
   and the body scrolls independently of the page.
---------------------------------------------------------------- */
const Lightbox = ({ item, onClose }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 0, y: 30, scale: 0.96 });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(panelRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: 'power3.out',
      delay: 0.05,
    });

    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    gsap.to(panelRef.current, { opacity: 0, y: 18, scale: 0.96, duration: 0.28, ease: 'power2.in' });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const isBlog = item.kind === 'blog';
  const showMedia = item.src && !failed;

  return createPortal(
    <div
      className="gx__overlay"
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={`gx__panel ${isBlog ? 'gx__panel--read' : ''}`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        <button
          className="gx__close"
          ref={closeBtnRef}
          onClick={handleClose}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>

        {showMedia && (
          <div className={`gx__media ${isBlog ? 'gx__media--banner' : ''}`}>
            {item.kind === 'video' ? (
              <video
                src={item.src}
                controls
                autoPlay
                loop
                muted
                playsInline
                onError={() => setFailed(true)}
              />
            ) : (
              <img src={item.src} alt={item.title} onError={() => setFailed(true)} />
            )}
          </div>
        )}

        <div className="gx__body">
          <span className="gx__tag">{item.tag}</span>
          <h3 className="gx__title">{item.title}</h3>

          <div className="gx__meta">
            <span>{item.date}</span>
            {item.readTime && <span>{item.readTime}</span>}
          </div>

          <div className="gx__prose">
            {isBlog ? <Prose body={item.body} /> : <p>{item.caption}</p>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ----------------------------------------------------------------
   Card
---------------------------------------------------------------- */
const GalleryCard = ({ item, onOpen }) => (
  <button
    type="button"
    className={`gl__card gl__card--${item.size} gl__card--${item.kind}`}
    onClick={() => onOpen(item)}
  >
    {item.kind !== 'blog' && (
      <span className="gl__card-media">
        <CardMedia item={item} />
        <span className="gl__card-shade" aria-hidden="true" />
        {item.kind === 'video' && (
          <span className="gl__card-play" aria-hidden="true">
            ▶
          </span>
        )}
      </span>
    )}

    <span className="gl__card-info">
      <span className="gl__card-tag">{item.tag}</span>
      <span className="gl__card-title">{item.title}</span>
      <span className="gl__card-caption">{item.caption}</span>
      <span className="gl__card-foot">
        <span className="gl__card-date">{item.date}</span>
        <span className="gl__card-cue">
          {item.kind === 'blog' ? 'Read more' : item.kind === 'video' ? 'Watch' : 'View'} →
        </span>
      </span>
    </span>
  </button>
);

/* ----------------------------------------------------------------
   Section
---------------------------------------------------------------- */
const Gallery = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const tabListRef = useRef(null);
  const tabPillRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [openItem, setOpenItem] = useState(null);
  const isFirstFilterRender = useRef(true);

  const KIND_BY_FILTER = { Photos: 'photo', Videos: 'video', Blog: 'blog' };

  const filteredItems =
    activeFilter === 'All'
      ? ITEMS
      : ITEMS.filter((item) => item.kind === KIND_BY_FILTER[activeFilter]);

  /* Header entrance + first-load card stagger */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const headEls = sectionRef.current.querySelectorAll('.gl__reveal');
        const cards = gridRef.current?.children;

        if (prefersReducedMotion) {
          gsap.set([headEls, cards], { opacity: 1, y: 0, scale: 1 });
          return;
        }

        gsap.fromTo(
          headEls,
          { opacity: 0, y: -28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
          }
        );

        gsap.fromTo(
          cards,
          { opacity: 0, y: 46, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            stagger: { each: 0.07, from: 'start' },
            scrollTrigger: { trigger: gridRef.current, start: 'top 88%' },
          }
        );
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

  /* Re-animate the grid whenever the filter changes */
  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = gridRef.current?.children;
    if (!cards?.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 28, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.05 }
    );
    ScrollTrigger.refresh();
  }, [activeFilter]);

  /* Sliding underline under the active filter */
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
    const positionPill = () => {
      const btn = tabListRef.current?.querySelector(`[data-filter="${activeFilter}"]`);
      if (btn) movePill(btn, false);
    };
    const fontsReady =
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(positionPill);
    window.addEventListener('resize', positionPill);
    return () => window.removeEventListener('resize', positionPill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (filter, e) => {
    setActiveFilter(filter);
    movePill(e.currentTarget, true);
  };

  return (
    <section className="gl" id="gallery" ref={sectionRef}>
      <div className="container gl__head">
        <span className="gl__eyebrow gl__reveal">Gallery / From the field</span>
        <h2 className="gl__title gl__reveal">Our work, on site</h2>
        <p className="gl__subtitle gl__reveal">
          Photos and footage from live deployments, company updates, and notes from the team on
          how these systems actually get built.
        </p>
      </div>

      <div className="container gl__tabs-wrap gl__reveal">
        <div className="gl__tabs" ref={tabListRef}>
          <span className="gl__pill" ref={tabPillRef} aria-hidden="true" />
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              data-filter={filter}
              className={`gl__tab ${activeFilter === filter ? 'is-active' : ''}`}
              onClick={(e) => handleTabClick(filter, e)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="gl__grid" ref={gridRef}>
          {filteredItems.map((item) => (
            <GalleryCard item={item} key={item.id} onOpen={setOpenItem} />
          ))}
        </div>
      </div>

      {openItem && <Lightbox item={openItem} onClose={() => setOpenItem(null)} />}
    </section>
  );
};

export default Gallery;