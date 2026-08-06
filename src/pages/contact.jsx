import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ContactPage.css';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   COMPANY DETAILS
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

const CHANNELS = [
  { id: 'email', label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}`, external: false },
  { id: 'phone', label: 'Phone', value: COMPANY.phone, href: `tel:+${digits(COMPANY.phone)}`, external: false },
  { id: 'whatsapp', label: 'WhatsApp', value: COMPANY.mobile, href: `https://wa.me/${digits(COMPANY.mobile)}`, external: true },
  { id: 'linkedin', label: 'LinkedIn', value: 'Sunic Technologies', href: COMPANY.linkedin, external: true },
];

const DIRECT_LINES = [
  { id: 'office', label: 'Office', text: COMPANY.phone, href: `tel:+${digits(COMPANY.phone)}`, external: false },
  { id: 'mob', label: 'Mobile / WhatsApp', text: COMPANY.mobile, href: `tel:+${digits(COMPANY.mobile)}`, external: false },
  { id: 'new', label: 'New projects', text: COMPANY.sales, href: `mailto:${COMPANY.sales}`, external: false },
  { id: 'gen', label: 'General', text: COMPANY.email, href: `mailto:${COMPANY.email}`, external: false },
  { id: 'car', label: 'Careers', text: COMPANY.careers, href: `mailto:${COMPANY.careers}`, external: false },
  { id: 'li', label: 'LinkedIn', text: 'Sunic Technologies', href: COMPANY.linkedin, external: true },
];

const PROJECT_TYPES = [
  { id: 'yard', code: 'YRD', label: 'Yard Management', desc: 'Real-time container tracking, slot allocation and crane coordination.' },
  { id: 'warehouse', code: 'WHS', label: 'Warehouse Automation', desc: 'Inventory control and pick-pack-ship for bonded or cross-dock floors.' },
  { id: 'rail', code: 'RAL', label: 'Rail Terminal', desc: 'Rake planning, wagon tracking and intermodal handoff.' },
  { id: 'gate', code: 'GTE', label: 'Gate Automation', desc: 'Unmanned gate-in / gate-out with OCR and e-seal verification.' },
  { id: 'ai', code: 'AIV', label: 'AI & Vision Systems', desc: 'Production computer vision and edge inference in live operations.' },
  { id: '3d', code: '3DM', label: '3D Digital Twin', desc: 'A full 3D replica of your site for planning and monitoring.' },
  { id: 'software', code: 'SFT', label: 'Custom Software', desc: 'Enterprise applications built around how your teams work.' },
  { id: 'other', code: 'OTH', label: 'Something else', desc: 'Describe the problem — we will help scope the right fit.' },
];

const DEPARTMENTS = [
  { id: 'sales', label: 'New project enquiry', contact: COMPANY.sales, sla: 'Within 1 business day' },
  { id: 'govt', label: 'Government & PSU tenders', contact: COMPANY.email, sla: 'Within 2 business days' },
  { id: 'support', label: 'Existing project support', contact: COMPANY.email, sla: 'Same business day' },
  { id: 'careers', label: 'Careers & hiring', contact: COMPANY.careers, sla: 'Within 3–4 business days' },
];

const BUDGETS = ['Under ₹10L', '₹10L – ₹50L', '₹50L – ₹2Cr', 'Above ₹2Cr', 'Not decided'];
const TIMELINES = ['Immediate', '1–3 months', '3–6 months', '6+ months', 'Exploring'];

const PROCESS = [
  { step: '01', title: 'You send the enquiry', desc: 'Project type, your site, and roughly what you are trying to solve. A rough note is fine to start.', time: '3 minutes' },
  { step: '02', title: 'We review and call you', desc: 'Routed to the right engineers, who call back to understand the site and the constraints.', time: '1 business day' },
  { step: '03', title: 'Scope and feasibility', desc: 'What is actually buildable at your site, what it involves, and what it will not solve.', time: '3–7 business days' },
  { step: '04', title: 'Survey and proposal', desc: 'A site survey, the 3D model, and a full proposal with timeline in front of you.', time: '2–4 weeks' },
];

const FAQS = [
  { q: 'How quickly will someone contact me?', a: 'For a new project enquiry, our team reaches out within one business day. Existing project support is answered the same business day. Government and PSU queries can take up to two business days, routed through our public sector team.' },
  { q: 'I am not sure which project I need.', a: 'That is most first conversations. Select "Something else" and describe the problem rather than the solution — we will work out which system fits, or tell you honestly if none of them do.' },
  { q: 'Do you work with government departments?', a: 'Yes. A significant part of our work is public sector — digitization, terminal automation and long-term support contracts, with the compliance discipline that work demands.' },
  { q: 'Do you integrate with our existing systems?', a: 'Almost always. Wholesale replacement is rarely right. Legacy integration is scoped as its own workstream with its own timeline, not squeezed into the main build.' },
  { q: 'What happens after go-live?', a: 'We stay. Every deployment includes a period where our engineers observe while your team operates, plus ongoing support. We measure a project by whether it still runs, unattended, two years on.' },
];

const ExtLink = ({ href, external, className, children }) =>
  external
    ? React.createElement('a', { href, className, target: '_blank', rel: 'noopener noreferrer' }, children)
    : React.createElement('a', { href, className }, children);

const FaqItem = ({ item, isOpen, onToggle }) => {
  const bodyRef = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      gsap.set(el, { height: 0, opacity: 0 });
      return;
    }
    gsap.to(el, isOpen
      ? { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      : { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
  }, [isOpen]);

  return (
    <div className={`cp__faq ${isOpen ? 'is-open' : ''}`}>
      <button className="cp__faq-q" onClick={onToggle} type="button" aria-expanded={isOpen}>
        <span className="cp__faq-num">{isOpen ? '—' : '+'}</span>
        <span>{item.q}</span>
      </button>
      <div className="cp__faq-a" ref={bodyRef}>
        <p>{item.a}</p>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const pageRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const successRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [projectType, setProjectType] = useState('');
  const [department, setDepartment] = useState('sales');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const activeDept = DEPARTMENTS.find((d) => d.id === department);
  const activeType = PROJECT_TYPES.find((t) => t.id === projectType);

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
          gsap.set('.cp__title-line', { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          '.cp__title-line',
          { opacity: 0, y: 46 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 }
        );

        gsap.fromTo(
          '.cp__hero-sub, .cp__hero-status',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1, delay: 0.5 }
        );

        reveals.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }
          );
        });

        gsap.fromTo(
          '.cp__step',
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.cp__process', start: 'top 78%' } }
        );

        if (railFillRef.current) {
          gsap.fromTo(
            railFillRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: railRef.current,
                start: 'top 60%',
                end: 'bottom 60%',
                scrub: 0.6,
              },
            }
          );
        }
      }, pageRef);

      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    };

    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const pageLoaded = document.readyState === 'complete'
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

  useEffect(() => {
    if (submitted && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 16, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
      );
    }
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const titleLines = ['Tell us what', 'you want to build'];

  return (
    <div className="cp" ref={pageRef}>
      {/* ---------- Hero ---------- */}
      <section className="cp__hero">
        <div className="cp__container cp__hero-grid">
          <div className="cp__hero-main">
            <span className="cp__eyebrow">Contact — 01 / Start a project</span>
            <h1 className="cp__title">
              {titleLines.map((line, i) => (
                <span className="cp__title-line" key={i}>{line}</span>
              ))}
            </h1>
            <p className="cp__hero-sub">
              Pick the project you have in mind, tell us about your site, and our team responds
              — usually within one business day. Not sure which system fits? Say so, and we
              will work it out with you.
            </p>
          </div>

          <div className="cp__hero-status">
            <span className="cp__status-label">Current status</span>
            <div className="cp__status-row">
              <span className="cp__status-dot" aria-hidden="true" />
              <span className="cp__status-text">Accepting new enquiries</span>
            </div>
            <dl className="cp__status-list">
              <div>
                <dt>Response time</dt>
                <dd>1 business day</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{COMPANY.hours}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{COMPANY.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="cp__container">
          <div className="cp__channels">
            {CHANNELS.map((ch) => (
              <ExtLink key={ch.id} href={ch.href} external={ch.external} className="cp__channel">
                <span className="cp__channel-label">{ch.label}</span>
                <span className="cp__channel-value">{ch.value}</span>
                <span className="cp__channel-arrow" aria-hidden="true">→</span>
              </ExtLink>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Main form ---------- */}
      <section className="cp__section">
        <div className="cp__container cp__layout">
          <aside className="cp__aside">
            <div className="cp__aside-block cp__reveal">
              <span className="cp__label-sm">Route your enquiry</span>
              <p className="cp__aside-text">
                Select the team below — your message goes straight to the right inbox instead
                of a general queue.
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
                  <span className="cp__dept-sla">{dept.sla}</span>
                </button>
              ))}
            </div>

            <div className="cp__aside-card cp__reveal">
              <span className="cp__aside-card-label">Routing to</span>
              <span className="cp__aside-card-value">{activeDept.contact}</span>
              <span className="cp__aside-card-note">{activeDept.sla}</span>
            </div>
          </aside>

          <div className="cp__form-wrap cp__reveal">
            {submitted ? (
              <div className="cp__success" ref={successRef}>
                <span className="cp__success-mark">✓</span>
                <h3>Enquiry received</h3>
                <p>
                  Routed to our <strong>{activeDept.label.toLowerCase()}</strong> team.
                  Expect a response <strong>{activeDept.sla.toLowerCase()}</strong>.
                </p>
                <p className="cp__success-sub">
                  Urgent? Call {COMPANY.phone} during office hours.
                </p>
                <button type="button" className="cp__btn cp__btn--ghost" onClick={() => setSubmitted(false)}>
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form className="cp__form" onSubmit={handleSubmit}>
                <div className="cp__form-head">
                  <h2 className="cp__form-title">Project enquiry</h2>
                  <span className="cp__form-tag">Fields marked * are required</span>
                </div>

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
                        <span className="cp__type-code">{type.code}</span>
                        <span className="cp__type-label">{type.label}</span>
                      </button>
                    ))}
                  </div>
                  {activeType && <p className="cp__type-desc">{activeType.desc}</p>}
                </fieldset>

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

                <fieldset className="cp__field cp__field--full">
                  <legend className="cp__legend">Indicative budget</legend>
                  <div className="cp__chips">
                    {BUDGETS.map((b) => (
                      <button key={b} type="button" className={`cp__chip ${budget === b ? 'is-active' : ''}`} onClick={() => setBudget(b)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="cp__field cp__field--full">
                  <legend className="cp__legend">When do you want to start?</legend>
                  <div className="cp__chips">
                    {TIMELINES.map((t) => (
                      <button key={t} type="button" className={`cp__chip ${timeline === t ? 'is-active' : ''}`} onClick={() => setTimeline(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="cp__field cp__field--full">
                  <span className="cp__label">Tell us about the requirement *</span>
                  <textarea name="details" rows="5" placeholder="Scale of operations, existing systems, what is not working today..." required />
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
            <span className="cp__label-sm">What happens next</span>
            <h2 className="cp__section-title">From enquiry to proposal</h2>
          </div>

          <div className="cp__process" ref={railRef}>
            <div className="cp__rail" aria-hidden="true">
              <span className="cp__rail-fill" ref={railFillRef} />
            </div>
            {PROCESS.map((p) => (
              <div className="cp__step" key={p.step}>
                <span className="cp__step-num">{p.step}</span>
                <div className="cp__step-body">
                  <div className="cp__step-top">
                    <h3>{p.title}</h3>
                    <span className="cp__step-time">{p.time}</span>
                  </div>
                  <p>{p.desc}</p>
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
            <span className="cp__label-sm">Common questions</span>
            <h2 className="cp__section-title">Before you write to us</h2>
          </div>

          <div className="cp__faqs cp__reveal">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Direct lines ---------- */}
      <section className="cp__section cp__section--last">
        <div className="cp__container">
          <div className="cp__final cp__reveal">
            <div className="cp__final-main">
              <span className="cp__label-sm cp__label-sm--onink">Direct lines</span>
              <h2 className="cp__final-title">Prefer to talk to someone?</h2>
              <p>
                Call the office during working hours, or reach the right inbox directly.
                Anything running live on site goes through the support line.
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