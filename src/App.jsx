import React from 'react';
import Logo from './components/Logo';
import Products from './components/Products';
import Services from './components/Services';
import Benefits from './components/Benefits';
import SuccessCases from './components/SuccessCases';
import FAQ from './components/FAQ';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import HeroVisual from './components/HeroVisual';
import { 
  ArrowRight,
  CheckCircle2,
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
              <a href="#servicios" className={styles.navLink}>Servicio tecnico</a>
              <a href="#productos" className={styles.navLink}>Soluciones digitales</a>
              <a href="#beneficios" className={styles.navLink}>Beneficios</a>
              <a href="#clientes" className={styles.navLink}>Clientes</a>
              <a href="#contacto" className={styles.navLink}>Contacto</a>
              <a href="/login" className={styles.loginButton}>Iniciar sesion</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>Software + Servicio técnico</div>
              
              {/* Propuesta principal equilibrada */}
              <div className={styles.heroSectionItem}>
                <h1 className={styles.heroTitle}>
                  Software y mantenimiento
                  <span className={styles.heroSubtitle}>
                    para equipamiento médico
                  </span>
                </h1>
                <p className={styles.heroDescription}>
                  Digitalizamos la gestión y resolvemos el mantenimiento preventivo y correctivo
                  de equipos médicos en taller y en campo. Una sola solución para operación técnica
                  y trazabilidad completa.
                </p>
              </div>

              {/* Bloque secundario */}
              <div className={styles.heroSectionItem}>
                <h2 className={styles.heroTitleSecondary}>
                  Tecnología aplicada a salud
                  <span className={styles.heroSubtitleSecondary}>
                    Gestión inteligente + soporte biomédico
                  </span>
                </h2>
                <p className={styles.heroDescriptionSecondary}>
                  Centralizá intervenciones, repuestos, accesorios, proveedores y reportes.
                  Reducí tiempos de parada con mantenimiento planificado y respuesta técnica
                  para correctivos cuando más lo necesitás.
                </p>
              </div>

              <div className={styles.heroButtons}>
                <a 
                  href="#servicios" 
                  className={styles.heroPrimaryButton}
                >
                  <span>Ver servicios</span>
                  <ArrowRight className={styles.heroButtonIcon} />
                </a>
                <a 
                  href="https://wa.me/5492944369647?text=Hola%2C%20quiero%20solicitar%20servicio%20tecnico%20de%20equipamiento%20medico" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.heroSecondaryButton}
                >
                  Solicitar servicio técnico
                </a>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.heroStripSection}>
        <div className={styles.heroStripContainer}>
          <div className={styles.heroStripItem}>
            <CheckCircle2 className={styles.heroStripIcon} />
            <span>Mantenimiento preventivo</span>
          </div>
          <div className={styles.heroStripItem}>
            <CheckCircle2 className={styles.heroStripIcon} />
            <span>Mantenimiento correctivo</span>
          </div>
          <div className={styles.heroStripItem}>
            <CheckCircle2 className={styles.heroStripIcon} />
            <span>Plataforma de gestión técnica</span>
          </div>
        </div>
      </section>

      {/* Clientes */}
      <SuccessCases />

      {/* Servicios Section */}
      <Services />

      {/* Products Section */}
      <Products />

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