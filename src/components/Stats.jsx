import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Stats.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 128, suffix: '+', label: 'Countries connected' },
  { target: 3400, suffix: '+', label: 'Fleet & partner vehicles' },
  { target: 98.6, suffix: '%', label: 'On-time delivery rate', decimals: 1 },
  { target: 24, suffix: '/7', label: 'Live shipment support' },
];

const Stats = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animationƒˇ
      const counters = gsap.utils.toArray('.stat__value');
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals);
          },
        });
      });

      // Parallax background lane pattern
      gsap.to(bgRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="stats" id="stats" ref={sectionRef}>
      <div className="stats__bg" ref={bgRef} aria-hidden="true" />
      <div className="container stats__inner">
        <div className="stats__grid">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <span
                className="stat__value"
                data-target={s.target}
                data-decimals={s.decimals || 0}
              >
                0
              </span>
              <span className="stat__suffix">{s.suffix}</span>
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
