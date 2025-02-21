import React, { useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/homepage/HeroSection';
import Services from '../components/homepage/Services';
import AboutUs from '../components/homepage/AboutUs';
import ContactUs from '../components/homepage/ContactUs';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref, offset = 65) => {
    const sectionTop = ref.current.offsetTop;
    window.scrollTo({
      top: sectionTop - offset,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Navbar
        scrollToSection={scrollToSection}
        refs={{ servicesRef, aboutRef, contactRef }}
      />
      <div ref={heroRef}>
        <HeroSection />
      </div>
      <div ref={servicesRef}>
        <Services />
      </div>
      <div ref={aboutRef}>
        <AboutUs />
      </div>
      <div ref={contactRef}>
        <ContactUs />
      </div>
      <Footer />
    </>
  );
}
