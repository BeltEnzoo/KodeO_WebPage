import React from 'react';
import Logo from './components/Logo';
import Products from './components/Products';
import Services from './components/Services';
import Benefits from './components/Benefits';
import FAQ from './components/FAQ';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { 
  Phone,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <Logo />
            <nav className={styles.headerNav}>
              <a href="#productos" className={styles.navLink}>Nuestros Productos</a>
              <a href="#beneficios" className={styles.navLink}>Beneficios</a>
              <a href="#precios" className={styles.navLink}>Precios</a>
              <a href="#contacto" className={styles.navLink}>Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  KodeON
                  <span className={styles.heroSubtitle}>
                    Agencia de Software para la Salud
                  </span>
                </h1>
                <p className={styles.heroDescription}>
                  Desarrollamos software especializado para todo el sector salud.
                  Consultorios, clínicas, hospitales, equipos médicos y farmacias.
                  Soluciones a medida para cada necesidad.
                </p>
            <div className={styles.heroButtons}>
              <a 
                href="#productos" 
                className={styles.heroPrimaryButton}
              >
                <span>Ver Productos</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#contacto" 
                className={styles.heroSecondaryButton}
              >
                Desarrollar mi App
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <Products />

      {/* Servicios Section */}
      <Services />

      {/* Beneficios Section */}
      <Benefits />

      {/* FAQ Section */}
      <FAQ />

      {/* Pricing Section */}
      <Pricing />

      {/* Contact Section */}
      <Contact />

          {/* Footer */}
          <Footer />

          {/* WhatsApp Flotante */}
          <a 
            href="https://wa.me/5492944369647?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20KodeON" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.whatsappFloating}
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className={styles.whatsappIcon} />
            <span className={styles.whatsappText}>WhatsApp</span>
          </a>

          {/* Botón Volver Arriba */}
          <BackToTop />
        </div>
      );
    }

    export default App;