import './HomePage.css';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/homepage/HeroSection';
import Services from '../components/homepage/Services';
import AboutUs from '../components/homepage/AboutUs';
import ContactUs from '../components/homepage/ContactUs';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Services />
      <AboutUs />
      <ContactUs />
      <Footer />
    </>
  );
}
