import React from 'react';
import { CheckCircle } from 'lucide-react';
import styles from './Benefits.module.css';

const Benefits = () => {
  return (
    <section id="beneficios" className={styles.benefitsSection}>
      <div className={styles.benefitsContainer}>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitsContent}>
            <h2 className={styles.benefitsTitle}>
              ¿Qué cambia cuando trabajás con KodeON?
            </h2>
            <p className={styles.benefitsDescription}>
              Combinamos plataforma digital con experiencia técnica para resolver la operación de
              equipamiento médico de punta a punta.
            </p>
            
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <CheckCircle className={styles.benefitIconContent} />
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Operación clínica y técnica unificadas</h3>
                  <p className={styles.benefitDescription}>Un solo lugar para software de gestión, historial de equipos, intervenciones, accesorios, proveedores y costos asociados.</p>
                </div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <CheckCircle className={styles.benefitIconContent} />
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Menos tiempos de parada, más disponibilidad</h3>
                  <p className={styles.benefitDescription}>Con mantenimiento preventivo/correctivo planificado mejorás continuidad de servicio y reducís urgencias operativas.</p>
                </div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <CheckCircle className={styles.benefitIconContent} />
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Decisiones basadas en datos reales</h3>
                  <p className={styles.benefitDescription}>Dashboards y balance técnico-financiero para priorizar mantenimiento, controlar costos y escalar con orden.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
