import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home.jsx';
import CareersPage from './pages/CareersPage.jsx';
import About from './pages/About.jsx';
import Gallery from './pages/Gallery.jsx';
import Clients from './pages/Clients.jsx';
import ContactPage from './pages/contact.jsx';

import './App.css';

/* Scrolls to top on a real route change (e.g. "/" -> "/careers").
   Skipped when the URL has a hash (like "/#services") — that case
   is handled by Home.jsx, which smooth-scrolls to the section. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;