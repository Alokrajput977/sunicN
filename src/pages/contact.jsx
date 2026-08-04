import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ContactPage.css';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   COMPANY DETAILS — apni real details yahan se update karein
   ================================================================ */
const COMPANY = {
  email: 'info@sunictechnologies.com',
  sales: 'sales@sunictechnologies.com',
  careers: 'careers@sunictechnologies.com',
  phone: '+91 124 000 0000',
  mobile: '+91 98765 43210',
  linkedin: 'https://www.linkedin.com/company/sunic-technologies',
  address: 'Gurugram, Haryana, India',
  hours: 'Mon — Sat, 9:30 AM – 6:30 PM IST',
};

const digits = (s) => s.replace(/[^0-9]/g, '');

/* Contact channels — mapped, so there is only one <a> tag in the JSX */
const CHANNELS = [
  {
    id: 'email',
    label: 'Email us',
    value: COMPANY.email,
    note: 'General enquiries and project scoping',
    href: `mailto:${COMPANY.email}`,
    external: false,
  },
  {
    id: 'phone',
    label: 'Call the office',
    value: COMPANY.phone,
    note: COMPANY.hours,
    href: `tel:+${digits(COMPANY.phone)}`,
    external: false,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: COMPANY.mobile,
    note: 'Quick questions and follow-ups',
    href: `https://wa.me/${digits(COMPANY.mobile)}`,
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'Sunic Technologies',
    note: 'Company updates and project news',
    href: COMPANY.linkedin,
    external: true,
  },
];

/* Direct lines shown in the closing card */
const DIRECT_LINES = [
  { id: 'office', label: 'Office', text: COMPANY.phone, href: `tel:+${digits(COMPANY.phone)}`, external: false },
  { id: 'mob', label: 'Mobile / WhatsApp', text: COMPANY.mobile, href: `tel:+${digits(COMPANY.mobile)}`, external: false },
  { id: 'new', label: 'New projects', text: COMPANY.sales, href: `mailto:${COMPANY.sales}`, external: false },
  { id: 'gen', label: 'General', text: COMPANY.email, href: `mailto:${COMPANY.email}`, external: false },
  { id: 'car', label: 'Careers', text: COMPANY.careers, href: `mailto:${COMPANY.careers}`, external: false },
  { id: 'li', label: 'LinkedIn', text: 'Sunic Technologies', href: COMPANY.linkedin, external: true },
];

const PROJECT_TYPES = [
  {
    id: 'yard',
    label: 'Yard Management System',
    desc: 'Real-time container tracking, slot allocation and crane coordination across your terminal.',
  },
  {
    id: 'warehouse',
    label: 'Warehouse Automation',
    desc: 'Inventory control, pick-pack-ship, and bonded or cross-dock warehouse operations.',
  },
  {
    id: 'rail',
    label: 'Rail Terminal Solutions',
    desc: 'Rake planning, wagon tracking and intermodal handoff for rail-linked terminals.',
  },
  {
    id: 'gate',
    label: 'Gate Automation',
    desc: 'Unmanned gate-in / gate-out with OCR, e-seal verification and digital documentation.',
  },
  {
    id: 'ai',
    label: 'AI & Vision Systems',
    desc: 'Production computer vision, OCR and edge inference built into live operations.',
  },
  {
    id: '3d',
    label: '3D Modeling & Digital Twin',
    desc: 'A full 3D replica of your site for planning, simulation and operational monitoring.',
  },
  {
    id: 'software',
    label: 'Custom Software',
    desc: 'Web and enterprise applications built around how your teams actually work.',
  },
  {
    id: 'other',
    label: 'Something else',
    desc: 'Not sure which fits? Describe the problem and we will scope it with you.',
  },
];

const DEPARTMENTS = [
  {
    id: 'sales',
    label: 'New project enquiry',
    desc: 'Scoping a new automation, AI or software project.',
    contact: COMPANY.sales,
    sla: 'Within 1 business day',
  },
  {
    id: 'govt',
    label: 'Government & PSU tenders',
    desc: 'Public sector engagements, tender documentation and compliance queries.',
    contact: COMPANY.email,
    sla: 'Within 2 business days',
  },
  {
    id: 'support',
    label: 'Existing project support',
    desc: 'You already run a Sunic system and need technical help.',
    contact: COMPANY.email,
    sla: 'Same business day',
  },
  {
    id: 'careers',
    label: 'Careers & hiring',
    desc: 'Applications, internships and general hiring questions.',
    contact: COMPANY.careers,
    sla: 'Within 3–4 business days',
  },
];

const BUDGETS = ['Under ₹10L', '₹10L — ₹50L', '₹50L — ₹2Cr', 'Above ₹2Cr', 'Not decided yet'];
const TIMELINES = ['Immediate', '1 — 3 months', '3 — 6 months', '6+ months', 'Just exploring'];

const PROCESS = [
  {
    step: '01',
    title: 'You send the enquiry',
    desc: 'Tell us the project type, your site and roughly what you are trying to solve. Detail helps, but a rough note is fine to start.',
    time: 'Takes 3 minutes',
  },
  {
    step: '02',
    title: 'Our team reviews and calls you',
    desc: 'A member of our team reads it, routes it to the right engineers, and calls you back to understand the site and the constraints.',
    time: 'Within 1 business day',
  },
  {
    step: '03',
    title: 'Scope and feasibility outline',
    desc: 'We come back with what is actually buildable at your site, what it would involve, and an honest view of what it will not solve.',
    time: '3 — 7 business days',
  },
  {
    step: '04',
    title: 'Proposal and site survey',
    desc: 'If it is a fit, we run a site survey, build the 3D model, and put a full proposal and timeline in front of you.',
    time: '2 — 4 weeks',
  },
];

const FAQS = [
  {
    q: 'How quickly will someone contact me?',
    a: 'For a new project enquiry, a member of our team will reach out within one business day. Existing project support is answered the same business day. Government and PSU queries can take up to two business days because they are routed through our public sector team.',
  },
  {
    q: 'I am not sure which project I need. Can you help?',
    a: 'Yes — that is most of our first conversations. Select "Something else" in the form and describe the problem rather than the solution. Our team will work out which of our systems fits, or tell you honestly if none of them do.',
  },
  {
    q: 'Do you work with government departments and PSUs?',
    a: 'Yes. A significant part of our work is public sector — departmental digitization, terminal automation and long-term support contracts. We are familiar with tender documentation, compliance requirements and the longer timelines these engagements run on.',
  },
  {
    q: 'Do you integrate with our existing systems?',
    a: 'Almost always. Wholesale replacement is rarely the right answer. We treat legacy integration as its own workstream with its own timeline rather than assuming it will fit inside the main build.',
  },
  {
    q: 'What happens after the system goes live?',
    a: 'We stay. Every deployment includes a period where our engineers observe while your team operates, plus ongoing maintenance and support. We measure a project by whether it still runs unattended two years later.',
  },
];

/* ----------------------------------------------------------------
   Link helper — keeps every anchor on a single line in the JSX
---------------------------------------------------------------- */
const ExtLink = ({ href, external, className, children }) => {
  const extra = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return React.createElement('a', { href, className, ...extra }, children);
};

/* ----------------------------------------------------------------
   FAQ accordion item
---------------------------------------------------------------- */
const FaqItem = ({ item, isOpen, onToggle }) => {
  const bodyRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(el, { height: 0, opacity: 0 });
      return;
    }
    if (isOpen) {
      gsap.to(el, { height: 'auto', opacity: 1, duration: 0.42, ease: 'power2.out' });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.32, ease: 'power2.in' });
    }
  }, [isOpen]);

  return (
    <div className={`cp__faq ${isOpen ? 'is-open' : ''}`}>
      <button className="cp__faq-q" onClick={onToggle} type="button" aria-expanded={isOpen}>
        <span>{item.q}</span>
        <span className="cp__faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="cp__faq-a" ref={bodyRef}>
        <p>{item.a}</p>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------
   Page
---------------------------------------------------------------- */
const ContactPage = () => {
  const pageRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [projectType, setProjectType] = useState('');
  const [department, setDepartment] = useState('sales');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const activeDept = DEPARTMENTS.find((d) => d.id === department);
  const activeType = PROJECT_TYPES.find((t) => t.id === projectType);

  /* Entrance animations */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const reveals = pageRef.current.querySelectorAll('.cp__reveal');

        if (reduced) {
          gsap.set(reveals, { opacity: 1, y: 0 });
          gsap.set('.cp__title-word', { opacity: 1, y: 0, rotateX: 0 });
          return;
        }

        gsap.fromTo(
          '.cp__title-word',
          { opacity: 0, y: 40, rotateX: -40 },
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

        reveals.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 34 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%' },
            }
          );
        });

        gsap.fromTo(
          '.cp__step',
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: { trigger: '.cp__process', start: 'top 82%' },
          }
        );
      }, pageRef);

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

  /* Success pop-in */
  useEffect(() => {
    if (submitted && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }
      );
    }
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const titleWords = 'Tell us what you want to build'.split(' ');

  return (
    <div className="cp" ref={pageRef}>
      {/* ---------- Hero ---------- */}
      <section className="cp__hero">
        <div className="cp__container cp__hero-inner">
          <span className="cp__eyebrow">Contact / Start a project</span>
          <h1 className="cp__title">
            {titleWords.map((w, i) => (
              <span className="cp__title-word" key={i}>{w}</span>
            ))}
          </h1>
          <p className="cp__subtitle">
            Pick the project you have in mind, tell us about your site, and our team will get
            back to you — usually within one business day. If you are not sure which system you
            need, say so and we will work it out with you.
          </p>

          <div className="cp__hero-meta">
            <span className="cp__hero-chip">
              <span className="cp__pulse" aria-hidden="true" />
              Replies within 1 business day
            </span>
            <span className="cp__hero-chip">{COMPANY.hours}</span>
            <span className="cp__hero-chip">{COMPANY.address}</span>
          </div>
        </div>
      </section>

      {/* ---------- Direct contact strip ---------- */}
      <section className="cp__strip">
        <div className="cp__container">
          <div className="cp__channels">
            {CHANNELS.map((ch) => (
              <ExtLink key={ch.id} href={ch.href} external={ch.external} className="cp__channel cp__reveal">
                <span className="cp__channel-label">{ch.label}</span>
                <span className="cp__channel-value">{ch.value}</span>
                <span className="cp__channel-note">{ch.note}</span>
                <span className="cp__channel-arrow" aria-hidden="true">→</span>
              </ExtLink>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Main form ---------- */}
      <section className="cp__section">
        <div className="cp__container cp__layout">
          {/* Left: guidance */}
          <aside className="cp__aside">
            <div className="cp__aside-block cp__reveal">
              <span className="cp__eyebrow cp__eyebrow--plain">Which team handles this</span>
              <p className="cp__aside-text">
                Select the right department below and your enquiry goes straight to the people
                who can answer it, instead of sitting in a general inbox.
              </p>
            </div>

            <div className="cp__depts cp__reveal">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  className={`cp__dept ${department === dept.id ? 'is-active' : ''}`}
                  onClick={() => setDepartment(dept.id)}
                >
                  <span className="cp__dept-label">{dept.label}</span>
                  <span className="cp__dept-desc">{dept.desc}</span>
                  <span className="cp__dept-sla">{dept.sla}</span>
                </button>
              ))}
            </div>

            <div className="cp__aside-card cp__reveal">
              <span className="cp__aside-card-label">Routing to</span>
              <span className="cp__aside-card-value">{activeDept.contact}</span>
              <span className="cp__aside-card-note">
                Response time — {activeDept.sla.toLowerCase()}
              </span>
            </div>
          </aside>

          {/* Right: form */}
          <div className="cp__form-wrap cp__reveal">
            {submitted ? (
              <div className="cp__success" ref={successRef}>
                <span className="cp__success-mark">✓</span>
                <h3>Enquiry received</h3>
                <p>
                  Thanks — your enquiry has been routed to our{' '}
                  <strong>{activeDept.label.toLowerCase()}</strong> team. Someone will contact
                  you <strong>{activeDept.sla.toLowerCase()}</strong>.
                </p>
                <p className="cp__success-sub">
                  If it is urgent, call us directly on {COMPANY.phone} during office hours.
                </p>
                <button
                  type="button"
                  className="cp__btn cp__btn--ghost"
                  onClick={() => setSubmitted(false)}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form className="cp__form" ref={formRef} onSubmit={handleSubmit}>
                <div className="cp__form-head">
                  <h2 className="cp__form-title">Project enquiry</h2>
                  <p className="cp__form-sub">
                    Fields marked with an asterisk are required. Everything else helps us scope
                    faster.
                  </p>
                </div>

                {/* Project type */}
                <fieldset className="cp__field cp__field--full">
                  <legend className="cp__legend">Which project do you want built? *</legend>
                  <div className="cp__types">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        className={`cp__type ${projectType === type.id ? 'is-active' : ''}`}
                        onClick={() => setProjectType(type.id)}
                      >
                        <span className="cp__type-label">{type.label}</span>
                        <span className="cp__type-check" aria-hidden="true">✓</span>
                      </button>
                    ))}
                  </div>
                  {activeType && <p className="cp__type-desc">{activeType.desc}</p>}
                </fieldset>

                {/* Name / org */}
                <div className="cp__row">
                  <label className="cp__field">
                    <span className="cp__label">Full name *</span>
                    <input type="text" name="name" placeholder="Rahul Sharma" required />
                  </label>
                  <label className="cp__field">
                    <span className="cp__label">Organisation *</span>
                    <input type="text" name="org" placeholder="Company or department" required />
                  </label>
                </div>

                <div className="cp__row">
                  <label className="cp__field">
                    <span className="cp__label">Work email *</span>
                    <input type="email" name="email" placeholder="you@company.com" required />
                  </label>
                  <label className="cp__field">
                    <span className="cp__label">Phone *</span>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" required />
                  </label>
                </div>

                <div className="cp__row">
                  <label className="cp__field">
                    <span className="cp__label">Site location</span>
                    <input type="text" name="site" placeholder="Mundra, Gujarat" />
                  </label>
                  <label className="cp__field">
                    <span className="cp__label">Organisation type</span>
                    <select name="orgType" defaultValue="">
                      <option value="" disabled>Select one</option>
                      <option>Private company</option>
                      <option>Government department</option>
                      <option>Public sector undertaking</option>
                      <option>Port / terminal operator</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>

                {/* Budget */}
                <fieldset className="cp__field cp__field--full">
                  <legend className="cp__legend">Indicative budget</legend>
                  <div className="cp__chips">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`cp__chip ${budget === b ? 'is-active' : ''}`}
                        onClick={() => setBudget(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Timeline */}
                <fieldset className="cp__field cp__field--full">
                  <legend className="cp__legend">When do you want to start?</legend>
                  <div className="cp__chips">
                    {TIMELINES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`cp__chip ${timeline === t ? 'is-active' : ''}`}
                        onClick={() => setTimeline(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="cp__field cp__field--full">
                  <span className="cp__label">Tell us about the requirement *</span>
                  <textarea
                    name="details"
                    rows="5"
                    placeholder="Scale of operations, existing systems, what is not working today, anything we should know about the site..."
                    required
                  />
                </label>

                <label className="cp__field cp__field--full">
                  <span className="cp__label">Preferred contact method</span>
                  <select name="preferred" defaultValue="Phone call">
                    <option>Phone call</option>
                    <option>Email</option>
                    <option>WhatsApp</option>
                    <option>Video meeting</option>
                  </select>
                </label>

                <div className="cp__submit-row">
                  <button type="submit" className="cp__btn">Send enquiry</button>
                  <span className="cp__submit-note">
                    Routed to {activeDept.label.toLowerCase()} — {activeDept.sla.toLowerCase()}
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="cp__section cp__band">
        <div className="cp__container">
          <div className="cp__section-head cp__reveal">
            <span className="cp__eyebrow">What happens next</span>
            <h2 className="cp__section-title">From enquiry to proposal</h2>
            <p className="cp__section-sub">
              No black box. Here is exactly what happens after you press send, and how long each
              stage takes.
            </p>
          </div>

          <div className="cp__process">
            {PROCESS.map((p) => (
              <div className="cp__step" key={p.step}>
                <span className="cp__step-num">{p.step}</span>
                <div className="cp__step-body">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <span className="cp__step-time">{p.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="cp__section">
        <div className="cp__container cp__faq-layout">
          <div className="cp__faq-head cp__reveal">
            <span className="cp__eyebrow">Common questions</span>
            <h2 className="cp__section-title">Before you write to us</h2>
            <p className="cp__section-sub">
              Still unclear on something? Ask it in the form — we would rather answer it
              directly.
            </p>
          </div>

          <div className="cp__faqs cp__reveal">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Footer card ---------- */}
      <section className="cp__section cp__section--last">
        <div className="cp__container">
          <div className="cp__final cp__reveal">
            <div className="cp__final-main">
              <span className="cp__eyebrow">Direct lines</span>
              <h2 className="cp__section-title">Prefer to talk to someone?</h2>
              <p>
                Call the office during working hours, or reach the right inbox directly. For
                anything running live on site, use the support line and we will pick it up the
                same day.
              </p>
            </div>

            <div className="cp__final-grid">
              {DIRECT_LINES.map((line) => (
                <div className="cp__final-item" key={line.id}>
                  <span className="cp__final-label">{line.label}</span>
                  <ExtLink href={line.href} external={line.external}>{line.text}</ExtLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;