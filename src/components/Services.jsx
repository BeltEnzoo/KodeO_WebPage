import React from 'react';
import { Heart, Shield, BarChart3, CheckCircle } from 'lucide-react';
import styles from './Services.module.css';

const Services = () => {
  return (
    <section id="servicios" className={styles.servicesSection}>
      <div className={styles.servicesContainer}>
        <div className={styles.servicesHeader}>
          <h2 className={styles.servicesTitle}>Nuestros servicios de desarrollo</h2>
          <p className={styles.servicesSubtitle}>
            Servicios profesionales de desarrollo de software médico a medida
          </p>
        </div>
        
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIconBlue}`}>
              <Heart className={styles.serviceIconBlueStyle} />
            </div>
            <h3 className={styles.serviceTitle}>Gestión de equipamiento</h3>
            <p className={styles.serviceDescription}>
              Control completo del inventario médico, mantenimiento preventivo y seguimiento de estado de equipos.
            </p>
            <ul className={styles.serviceFeatures}>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Inventario en tiempo real</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Alertas de mantenimiento</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Reportes detallados</span>
              </li>
            </ul>
          </div>

          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIconGreen}`}>
              <BarChart3 className={styles.serviceIconGreenStyle} />
            </div>
            <h3 className={styles.serviceTitle}>Análisis y reportes</h3>
            <p className={styles.serviceDescription}>
              Dashboards intuitivos con métricas clave para la toma de decisiones informadas.
            </p>
            <ul className={styles.serviceFeatures}>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Dashboards personalizables</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Métricas de utilización</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Exportación de datos</span>
              </li>
            </ul>
          </div>

          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIconBlue}`}>
              <Shield className={styles.serviceIconBlueStyle} />
            </div>
            <h3 className={styles.serviceTitle}>Seguridad y cumplimiento</h3>
            <p className={styles.serviceDescription}>
              Cumplimiento con normativas médicas y protección de datos sensibles.
            </p>
            <ul className={styles.serviceFeatures}>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Encriptación de datos</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Cumplimiento normativo</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Auditoría completa</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
