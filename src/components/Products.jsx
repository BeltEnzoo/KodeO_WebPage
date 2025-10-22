import React from 'react';
import { Stethoscope, Building, Shield, Pill, Activity, Clock } from 'lucide-react';
import styles from './Products.module.css';

const Products = () => {
  return (
    <section id="productos" className={styles.productsSection}>
      <div className={styles.productsContainer}>
        <div className={styles.productsHeader}>
          <h2 className={styles.productsTitle}>Nuestros Productos</h2>
          <p className={styles.productsSubtitle}>
            Soluciones de software médico especializadas para cada sector de la salud
          </p>
        </div>
        
        <div className={styles.productsGrid}>
          <div className={styles.productCard}>
            <div className={styles.availableBadge}>Disponible</div>
            <div className={`${styles.productIconContainer} ${styles.productIconBlue}`}>
              <Stethoscope className={styles.productIconBlueStyle} />
            </div>
            <h3 className={styles.productTitle}>KodeON Consultorio</h3>
            <p className={styles.productDescription}>
              Software completo para consultorios médicos privados.
              Gestión de pacientes, turnos, historias clínicas y facturación.
            </p>
            <div className={styles.productFeatures}>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Gestión de turnos</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Historias clínicas</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Facturación digital</span>
              </div>
            </div>
            <a 
              href="https://wa.me/2281598338?text=Hola%2C%20me%20interesa%20KodeON%20Consultorio" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.productContactButton}
            >
              Consultar
            </a>
          </div>

          <div className={styles.productCard}>
            <div className={styles.comingSoonBadge}>¡Próximamente!</div>
            <div className={`${styles.productIconContainer} ${styles.productIconGreen}`}>
              <Building className={styles.productIconGreenStyle} />
            </div>
            <h3 className={styles.productTitle}>KodeON Clínica</h3>
            <p className={styles.productDescription}>
              Solución integral para clínicas y centros de salud.
              Administración completa, finanzas y recursos humanos.
            </p>
            <div className={styles.productFeatures}>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Administración completa</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Gestión de recursos</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Reportes avanzados</span>
              </div>
            </div>
            <div className={styles.productPriceComing}>Muy pronto disponible</div>
          </div>

          <div className={styles.productCard}>
            <div className={styles.availableBadge}>Disponible</div>
            <div className={`${styles.productIconContainer} ${styles.productIconBlue}`}>
              <Shield className={styles.productIconBlueStyle} />
            </div>
            <h3 className={styles.productTitle}>KodeON Hospital</h3>
            <p className={styles.productDescription}>
              Plataforma hospitalaria completa con gestión de equipamiento médico,
              cirugías, camas y todo el flujo hospitalario.
            </p>
            <div className={styles.productFeatures}>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Gestión de equipamiento</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Programación quirófano</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Control de camas</span>
              </div>
            </div>
            <a 
              href="https://wa.me/2281598338?text=Hola%2C%20me%20interesa%20KodeON%20Hospital" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.productContactButton}
            >
              Consultar
            </a>
          </div>

          <div className={styles.productCard}>
            <div className={styles.availableBadge}>Disponible</div>
            <div className={`${styles.productIconContainer} ${styles.productIconGreen}`}>
              <Activity className={styles.productIconGreenStyle} />
            </div>
            <h3 className={styles.productTitle}>KodeON Equipment</h3>
            <p className={styles.productDescription}>
              Software de gestión para equipos médicos. Monitoreo en tiempo real,
              mantenimiento preventivo y control de inventario.
            </p>
            <div className={styles.productFeatures}>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Monitoreo en tiempo real</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Mantenimiento predictivo</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Control de inventario</span>
              </div>
            </div>
            <a 
              href="https://wa.me/2281598338?text=Hola%2C%20me%20interesa%20KodeON%20Equipment" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.productContactButton}
            >
              Consultar
            </a>
          </div>

          <div className={styles.productCard}>
            <div className={styles.availableBadge}>Disponible</div>
            <div className={`${styles.productIconContainer} ${styles.productIconBlue}`}>
              <Pill className={styles.productIconBlueStyle} />
            </div>
            <h3 className={styles.productTitle}>KodeON Farmacia</h3>
            <p className={styles.productDescription}>
              Solución completa para farmacias hospitalarias y comunitarias.
              Stock, recetas digitales, interacciones y farmacovigilancia.
            </p>
            <div className={styles.productFeatures}>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Gestión de stock</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Recetas digitales</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Control de vencimientos</span>
              </div>
            </div>
            <a 
              href="https://wa.me/2281598338?text=Hola%2C%20me%20interesa%20KodeON%20Farmacia" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.productContactButton}
            >
              Consultar
            </a>
          </div>

          <div className={styles.productCard}>
            <div className={styles.availableBadge}>Disponible</div>
            <div className={`${styles.productIconContainer} ${styles.productIconGreen}`}>
              <Clock className={styles.productIconGreenStyle} />
            </div>
            <h3 className={styles.productTitle}>KodeON Turnera</h3>
            <p className={styles.productDescription}>
              Sistema de gestión de turnos para sala de espera. 
              El médico puede llamar pacientes desde el consultorio y en una pantalla se visualiza el llamado al paciente en la sala de espera.
            </p>
            <div className={styles.productFeatures}>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Llamada desde consultorio</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Pantalla de sala de espera</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Gestión de cola</span>
              </div>
            </div>
            <a 
              href="https://wa.me/2281598338?text=Hola%2C%20me%20interesa%20KodeON%20Turnera" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.productContactButton}
            >
              Consultar
            </a>
          </div>

          <div className={styles.productCard}>
            <div className={`${styles.productIconContainer} ${styles.productIconGreen}`}>
              <Shield className={styles.productIconGreenStyle} />
            </div>
            <h3 className={styles.productTitle}>Desarrollo Personalizado</h3>
            <p className={styles.productDescription}>
              ¿Necesitas algo específico? Desarrollamos software médico
              a medida para cualquier necesidad del sector salud.
            </p>
            <div className={styles.productFeatures}>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Desarrollo a medida</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Integración con sistemas</span>
              </div>
              <div className={styles.productFeature}>
                <div className={styles.productFeatureIcon}>✓</div>
                <span className={styles.productFeatureText}>Soporte especializado</span>
              </div>
            </div>
            <a 
              href="https://wa.me/2281598338?text=Hola%2C%20me%20interesa%20Desarrollo%20Personalizado" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.productContactButton}
            >
              Consultar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
