import React from 'react';
import { BarChart3, CheckCircle, Shield, Settings, Wrench, ClipboardCheck } from 'lucide-react';
import styles from './Services.module.css';

const Services = () => {
  return (
    <section id="servicios" className={styles.servicesSection}>
      <div className={styles.servicesContainer}>
        <div className={styles.servicesHeader}>
          <h2 className={styles.servicesTitle}>Servicio técnico biomédico + software de gestión</h2>
          <p className={styles.servicesSubtitle}>
            Primero resolvemos la operación del equipamiento. Después la escalamos con datos y procesos digitales.
          </p>
        </div>
        
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIconBlue}`}>
              <Settings className={styles.serviceIconBlueStyle} />
            </div>
            <h3 className={styles.serviceTitle}>Software de gestión técnica</h3>
            <p className={styles.serviceDescription}>
              Plataforma para registrar intervenciones, controlar inventario, historial y estado operativo de cada equipo.
            </p>
            <ul className={styles.serviceFeatures}>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Historial por equipo</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Intervenciones y trazabilidad</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Control de accesorios y repuestos</span>
              </li>
            </ul>
          </div>

          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIconGreen}`}>
              <BarChart3 className={styles.serviceIconGreenStyle} />
            </div>
            <h3 className={styles.serviceTitle}>Analítica y decisiones</h3>
            <p className={styles.serviceDescription}>
              Dashboards y métricas para conocer costos, ingresos, disponibilidad y rendimiento operativo.
            </p>
            <ul className={styles.serviceFeatures}>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Dashboards personalizables</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Métricas de utilización y fallas</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Balance operativo en tiempo real</span>
              </li>
            </ul>
          </div>

          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIconBlue}`}>
              <ClipboardCheck className={styles.serviceIconBlueStyle} />
            </div>
            <h3 className={styles.serviceTitle}>Mantenimiento preventivo</h3>
            <p className={styles.serviceDescription}>
              Planificación periódica para reducir paradas imprevistas y extender la vida útil del equipamiento médico.
            </p>
            <ul className={styles.serviceFeatures}>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Cronogramas por criticidad</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Checklist técnico estandarizado</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Registro documental de tareas</span>
              </li>
            </ul>
          </div>

          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIconGreen}`}>
              <Wrench className={styles.serviceIconGreenStyle} />
            </div>
            <h3 className={styles.serviceTitle}>Mantenimiento correctivo</h3>
            <p className={styles.serviceDescription}>
              Diagnóstico y resolución de fallas en campo o taller, con seguimiento técnico hasta cierre.
            </p>
            <ul className={styles.serviceFeatures}>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Atención de incidencias</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Gestión de proveedores y terciarización</span>
              </li>
              <li className={styles.serviceFeature}>
                <CheckCircle className={styles.serviceFeatureIcon} />
                <span className={styles.serviceFeatureText}>Trazabilidad de repuestos y costos</span>
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
