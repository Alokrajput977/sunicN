import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import VideoShowcase from '../components/VideoShowcase';
import Services from '../components/Services';
import Stats from '../components/Stats';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import about from './About.jsx';

const Home = () => {
  const location = useLocation();

  /* react-router doesn't auto-scroll to a hash on navigation the
     way a plain <a href="#services"> does within a single page —
     so if we arrived here as "/#services" (e.g. clicked "Modes"
     while on /careers), find that section and scroll to it
     ourselves once this page has rendered. */
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location]);

  return (
    <main>
      <Hero />
      <VideoShowcase />
      <Services />
      <About />
      <Gallery />
      <Stats />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default Home;