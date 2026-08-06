import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import VideoShowcase from '../components/VideoShowcase';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
  const location = useLocation();

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
      <Gallery />
      <Stats />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default Home;