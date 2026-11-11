import Header from './components/Header';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Strip from './components/Strip';
import Work from './components/Work';
import Services from './components/Services';
import Assistant from './components/Assistant';
import Process from './components/Process';
import Pricing from './components/Pricing';
import About from './components/About';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Capabilities />
        <Strip />
        <Work />
        <Services />
        <Assistant />
        <Process />
        <Pricing />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
