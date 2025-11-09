import React from 'react';
import { CheckCircle, Phone, Star, Zap } from 'lucide-react';
import styles from './Pricing.module.css';

const Pricing = () => {
  return (
    <section id="precios" className={styles.pricingSection}>
      <div className={styles.pricingContainer}>
        <div className={styles.pricingHeader}>
          <h2 className={styles.pricingTitle}>¿Listo para Transformar tu Institución?</h2>
          <p className={styles.pricingSubtitle}>Únete a las instituciones de salud que ya digitalizaron sus procesos con KodeON</p>
        </div>
        
        <div className={styles.pricingCardContainer}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingCardHeader}>
              <div className={styles.pricingMotivation}>
                <Star className={styles.motivationIcon} />
                <h3 className={styles.pricingCardTitle}>Solución Completa</h3>
                <p className={styles.pricingCardSubtitle}>Cualquier producto KodeON - Consultorios, Clínicas, Hospitales, Equipos, Farmacias</p>
              </div>
            </div>
            
            <div className={styles.pricingFeatures}>
              <div className={styles.pricingFeatureList}>
                <h4>Lo que incluye tu inversión:</h4>
                <ul>
                  <li className={styles.pricingFeatureItem}>
                    <CheckCircle className={styles.pricingFeatureIcon} />
                    <span className={styles.pricingFeatureText}>Desarrollo completo del software</span>
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <CheckCircle className={styles.pricingFeatureIcon} />
                    <span className={styles.pricingFeatureText}>Implementación y configuración</span>
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <CheckCircle className={styles.pricingFeatureIcon} />
                    <span className={styles.pricingFeatureText}>Soporte técnico 24/7</span>
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <CheckCircle className={styles.pricingFeatureIcon} />
                    <span className={styles.pricingFeatureText}>Capacitación del personal</span>
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <CheckCircle className={styles.pricingFeatureIcon} />
                    <span className={styles.pricingFeatureText}>Mantenimiento incluido</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={styles.pricingCTA}>
              <div className={styles.pricingMotivationText}>
                <Zap className={styles.zapIcon} />
                <span>¡No esperes más! Cada día sin digitalizar es tiempo perdido</span>
              </div>
              <a 
                href="https://wa.me/5492944369647?text=Hola%2C%20quiero%20transformar%20mi%20institución%20con%20KodeON" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.pricingButton}
              >
                <Phone className="w-5 h-5" />
                <span>¡Quiero Transformar mi Institución!</span>
              </a>
              <p className={styles.pricingNote}>
                Consulta sin compromiso • Implementación rápida • Resultados garantizados
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
