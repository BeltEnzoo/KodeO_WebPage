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
import HeroVisual from './components/HeroVisual';
import { 
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      {/* Top Bar - Contact Info */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.topBarLeft}>
            <div className={styles.topBarItem}>
              <Phone className={styles.topBarIcon} />
              <span>Buenos Aires: +54 9 2944 36-9647</span>
            </div>
            <div className={styles.topBarItem}>
              <Mail className={styles.topBarIcon} />
              <span>on.kode.soluciones@gmail.com</span>
            </div>
          </div>
          <div className={styles.topBarRight}>
            <a 
              href="https://www.instagram.com/kode.on.soluciones/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIconLink}
              aria-label="Instagram"
            >
              <Instagram className={styles.socialIcon} />
            </a>
            <a 
              href="https://www.facebook.com/kodeon.soluciones" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIconLink}
              aria-label="Facebook"
            >
              <Facebook className={styles.socialIcon} />
            </a>
            <a 
              href="https://www.linkedin.com/company/kodeon-health" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIconLink}
              aria-label="LinkedIn"
            >
              <Linkedin className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <Logo />
            <nav className={styles.headerNav}>
              <a href="#productos" className={styles.navLink}>Productos</a>
              <a href="#servicios" className={styles.navLink}>Servicios</a>
              <a href="#beneficios" className={styles.navLink}>Beneficios</a>
              <a href="#contacto" className={styles.navLink}>Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>Nuevo</div>
              
              {/* Primera Sección - Desarrollo de Aplicaciones Web */}
              <div className={styles.heroSectionItem}>
                <h1 className={styles.heroTitle}>
                  Desarrollo de aplicaciones web
                  <span className={styles.heroSubtitle}>
                    Especialistas en salud y más
                  </span>
                </h1>
                <p className={styles.heroDescription}>
                  Desarrollamos aplicaciones web a medida para todo tipo de empresas e instituciones. 
                  Especialistas en software médico para consultorios, clínicas y hospitales, 
                  pero también trabajamos con cualquier sector o industria.
                </p>
              </div>

              {/* Segunda Sección - Páginas Web en 24h */}
              <div className={styles.heroSectionItem}>
                <h2 className={styles.heroTitleSecondary}>
                  Páginas web profesionales
                  <span className={styles.heroSubtitleSecondary}>
                    Con dominio incluido en 24 horas
                  </span>
                </h2>
                <p className={styles.heroDescriptionSecondary}>
                  ¿Necesitas una página web rápida? Creamos páginas web profesionales y modernas 
                  con dominio incluido, listas en 24 horas. Ideal para empresas que necesitan 
                  presencia online inmediata.
                </p>
              </div>

              <div className={styles.heroButtons}>
                <a 
                  href="#productos" 
                  className={styles.heroPrimaryButton}
                >
                  <span>Ver productos</span>
                  <ArrowRight className={styles.heroButtonIcon} />
                </a>
                <a 
                  href="#contacto" 
                  className={styles.heroSecondaryButton}
                >
                  Solicitar presupuesto
                </a>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <HeroVisual />
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