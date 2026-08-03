import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Careers.css';

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------
   Job data — Sunic Technologies (IT / software company)
---------------------------------------------------------------- */
const DEPARTMENTS = ['All', 'Engineering', 'Security', 'Data & Cloud', 'Design', 'Consulting', 'Support'];

const JOBS = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    dept: 'Engineering',
    location: 'Gurugram, IN · Hybrid',
    type: 'Full-time',
    experience: '2–4 yrs',
    summary:
      'Build fast, accessible interfaces for client products using React and modern tooling, working closely with design and backend teams.',
    responsibilities: [
      'Ship UI features end-to-end from spec to production',
      'Work with designers to turn mockups into polished, responsive interfaces',
      'Improve performance and accessibility across existing products',
    ],
    requirements: [
      '2+ years building production React applications',
      'Strong CSS fundamentals and eye for detail',
      'Comfortable working directly with REST/GraphQL APIs',
    ],
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer (Node.js)',
    dept: 'Engineering',
    location: 'Gurugram, IN',
    type: 'Full-time',
    experience: '3–5 yrs',
    summary:
      'Design and maintain the services powering our client platforms — APIs, data pipelines, and the infrastructure that keeps them reliable.',
    responsibilities: [
      'Design and build scalable Node.js services and APIs',
      'Own database schema and query performance for core services',
      'Participate in on-call rotation and incident response',
    ],
    requirements: [
      '3+ years with Node.js in production environments',
      'Solid understanding of relational and NoSQL databases',
      'Experience with Docker and CI/CD pipelines',
    ],
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    dept: 'Engineering',
    location: 'Remote (India)',
    type: 'Full-time',
    experience: '3–6 yrs',
    summary:
      'Own the infrastructure and deployment pipelines that let our engineering teams ship confidently and often.',
    responsibilities: [
      'Manage cloud infrastructure across AWS/Azure environments',
      'Build and maintain CI/CD pipelines for multiple product teams',
      'Set up monitoring, alerting, and cost optimization practices',
    ],
    requirements: [
      '3+ years in a DevOps/SRE role',
      'Hands-on experience with Terraform or similar IaC tools',
      'Strong Linux and networking fundamentals',
    ],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    dept: 'Security',
    location: 'Gurugram, IN',
    type: 'Full-time',
    experience: '2–5 yrs',
    summary:
      'Help protect client systems and data — from vulnerability assessments to incident response and security tooling.',
    responsibilities: [
      'Run vulnerability assessments and penetration tests',
      'Monitor security alerts and lead incident response',
      'Advise engineering teams on secure coding practices',
    ],
    requirements: [
      '2+ years in a security-focused engineering role',
      'Familiarity with OWASP Top 10 and common attack patterns',
      'A security certification (CEH, Security+) is a plus',
    ],
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    dept: 'Data & Cloud',
    location: 'Gurugram, IN · Hybrid',
    type: 'Full-time',
    experience: '2–4 yrs',
    summary:
      'Build the data pipelines and warehouses that power analytics and AI features across client products.',
    responsibilities: [
      'Design and maintain ETL/ELT pipelines at scale',
      'Model data for analytics and downstream ML use cases',
      'Partner with product teams to define data contracts',
    ],
    requirements: [
      '2+ years working with large-scale data pipelines',
      'Strong SQL and experience with a modern warehouse (Snowflake/BigQuery)',
      'Working knowledge of Python for data tooling',
    ],
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Solutions Architect',
    dept: 'Data & Cloud',
    location: 'Remote (India)',
    type: 'Full-time',
    experience: '5–8 yrs',
    summary:
      'Design cloud architectures for enterprise clients migrating to or scaling on AWS/Azure/GCP.',
    responsibilities: [
      'Lead architecture design for client cloud migrations',
      'Define security, cost, and scalability standards',
      'Act as technical lead across multiple client engagements',
    ],
    requirements: [
      '5+ years designing production cloud architectures',
      'A cloud architecture certification (AWS/Azure)',
      'Comfortable presenting technical plans to client stakeholders',
    ],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    dept: 'Design',
    location: 'Gurugram, IN',
    type: 'Full-time',
    experience: '2–4 yrs',
    summary:
      'Design clear, usable interfaces for client products — from early wireframes to polished, developer-ready UI.',
    responsibilities: [
      'Own end-to-end design for one or more client products',
      'Run lightweight user research and usability checks',
      'Maintain and grow a shared component/design system',
    ],
    requirements: [
      '2+ years of product design experience',
      'Strong portfolio showing end-to-end product thinking',
      'Proficiency in Figma',
    ],
  },
  {
    id: 'it-consultant',
    title: 'IT Consultant',
    dept: 'Consulting',
    location: 'Gurugram, IN',
    type: 'Full-time',
    experience: '3–6 yrs',
    summary:
      'Work directly with client teams to assess systems, recommend solutions, and guide implementation.',
    responsibilities: [
      'Run technical assessments for prospective and existing clients',
      'Translate business requirements into implementation plans',
      'Support pre-sales conversations with technical scoping',
    ],
    requirements: [
      '3+ years in IT consulting or solutions engineering',
      'Comfortable working across varied tech stacks',
      'Strong written and verbal client communication',
    ],
  },
  {
    id: 'product-support-specialist',
    title: 'Product Support Specialist',
    dept: 'Support',
    location: 'Gurugram, IN',
    type: 'Full-time',
    experience: '1–3 yrs',
    summary:
      'Be the first line of support for client questions and issues — diagnosing problems and working with engineering to resolve them.',
    responsibilities: [
      'Triage and resolve incoming client support requests',
      'Maintain and improve our help center documentation',
      'Flag recurring issues to product and engineering teams',
    ],
    requirements: [
      '1+ years in a technical support or customer success role',
      'Clear written communication and patience under pressure',
      'Basic comfort reading logs/API responses to diagnose issues',
    ],
  },
];

/* ----------------------------------------------------------------
   Job detail modal — details -> apply -> success, all in one
   panel, each step cross-fading in via GSAP. Rendered through a
   portal so it always sits above everything regardless of any
   ancestor's overflow/transform.
---------------------------------------------------------------- */
const JobModal = ({ job, onClose }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const bodyRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [step, setStep] = useState('details'); // 'details' | 'apply' | 'success'
  const [fileName, setFileName] = useState('');
  const isFirstStepRender = useRef(true);

  /* Open/close + escape key + scroll lock */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 0, y: 26, scale: 0.97 });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(panelRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
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

  /* Cross-fade between details / apply / success */
  useEffect(() => {
    if (!bodyRef.current) return;
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    gsap.fromTo(
      bodyRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [step]);

  const handleClose = () => {
    gsap.to(panelRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.28, ease: 'power2.in' });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('success');
  };

  return createPortal(
    <div
      className="jm__overlay"
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className="jm__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${job.title} — job details`}
      >
        <button className="jm__close" ref={closeBtnRef} onClick={handleClose} aria-label="Close dialog">
          ✕
        </button>

        <div className="jm__body" ref={bodyRef}>
          {step === 'details' && (
            <>
              <span className="jm__dept">{job.dept}</span>
              <h3 className="jm__title">{job.title}</h3>

              <div className="jm__meta">
                <span>{job.location}</span>
                <span>{job.type}</span>
                <span>{job.experience}</span>
              </div>

              <p className="jm__summary">{job.summary}</p>

              <div className="jm__section">
                <h4>Responsibilities</h4>
                <ul>
                  {job.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="jm__section">
                <h4>What we're looking for</h4>
                <ul>
                  {job.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <button className="jm__cta" onClick={() => setStep('apply')}>
                Apply for this role
              </button>
            </>
          )}

          {step === 'apply' && (
            <>
              <button className="jm__back" onClick={() => setStep('details')} type="button">
                ← Back to role details
              </button>

              <h3 className="jm__title jm__title--tight">Apply — {job.title}</h3>
              <p className="jm__summary">
                Tell us a bit about yourself. We reply to every application within a few business
                days.
              </p>

              <form className="jm__form" onSubmit={handleSubmit}>
                <div className="jm__row">
                  <label>
                    <span>Full name</span>
                    <input type="text" name="name" placeholder="Ananya Sharma" required />
                  </label>
                  <label>
                    <span>Email</span>
                    <input type="email" name="email" placeholder="ananya@email.com" required />
                  </label>
                </div>

                <div className="jm__row">
                  <label>
                    <span>Phone</span>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" />
                  </label>
                  <label>
                    <span>LinkedIn / Portfolio</span>
                    <input type="text" name="portfolio" placeholder="linkedin.com/in/ananya" />
                  </label>
                </div>

                <label>
                  <span>Cover note</span>
                  <textarea
                    name="note"
                    rows="3"
                    placeholder="Why this role, and what you'd bring to it..."
                  />
                </label>

                <label className="jm__file">
                  <span>Resume</span>
                  <span className="jm__file-input">
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                    />
                    <span className="jm__file-btn">Choose file</span>
                    <span className="jm__file-name">{fileName || 'PDF or Word, up to 5MB'}</span>
                  </span>
                </label>

                <button type="submit" className="jm__cta">
                  Submit application
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className="jm__success">
              <span className="jm__success-mark">✓</span>
              <h3 className="jm__title jm__title--tight">Application received</h3>
              <p className="jm__summary">
                Thanks for applying to <strong>{job.title}</strong>. Our team will review your
                application and get back to you within a few business days.
              </p>
              <button className="jm__cta jm__cta--ghost" onClick={handleClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ----------------------------------------------------------------
   Careers section
---------------------------------------------------------------- */
const Careers = () => {
  const sectionRef = useRef(null);
  const tabListRef = useRef(null);
  const tabPillRef = useRef(null);
  const [activeDept, setActiveDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = activeDept === 'All' ? JOBS : JOBS.filter((j) => j.dept === activeDept);

  /* Scroll-in entrance for header, tabs, and job cards */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctx;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const targets = sectionRef.current.querySelectorAll('.cr__reveal');

        if (prefersReducedMotion) {
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          targets,
          { opacity: 0, y: -28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.05,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none play reverse',
            },
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

  /* Sliding pill under the active department tab */
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
      const btn = tabListRef.current?.querySelector(`[data-dept="${activeDept}"]`);
      if (btn) movePill(btn, false);
    };
    const fontsReady =
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(positionPill);
    window.addEventListener('resize', positionPill);
    return () => window.removeEventListener('resize', positionPill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (dept, e) => {
    setActiveDept(dept);
    movePill(e.currentTarget, true);
  };

  return (
    <section className="cr" id="careers" ref={sectionRef}>
      <div className="container cr__head">
        <span className="cr__eyebrow cr__reveal">Careers / Open roles</span>
        <h2 className="cr__title cr__reveal">Build what's next with us</h2>
        <p className="cr__subtitle cr__reveal">
          We're a Gurugram-based software team working with clients across banking, retail, and
          SaaS. Here's where we're hiring right now.
        </p>
      </div>

      <div className="container cr__tabs-wrap cr__reveal">
        <div className="cr__tabs" ref={tabListRef}>
          <span className="cr__pill" ref={tabPillRef} aria-hidden="true" />
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              type="button"
              data-dept={dept}
              className={`cr__tab ${activeDept === dept ? 'is-active' : ''}`}
              onClick={(e) => handleTabClick(dept, e)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="container cr__list">
        {filteredJobs.map((job) => (
          <button
            key={job.id}
            className="cr__job cr__reveal"
            onClick={() => setSelectedJob(job)}
            type="button"
          >
            <div className="cr__job-main">
              <span className="cr__job-dept">{job.dept}</span>
              <h3 className="cr__job-title">{job.title}</h3>
            </div>
            <div className="cr__job-meta">
              <span>{job.location}</span>
              <span>{job.type}</span>
              <span>{job.experience}</span>
            </div>
            <span className="cr__job-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </section>
  );
};

export default Careers;