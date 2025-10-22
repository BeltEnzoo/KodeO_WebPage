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
              ¿Por qué elegir KodeON?
            </h2>
            <p className={styles.benefitsDescription}>
              Como agencia especializada en software médico, desarrollamos soluciones integrales 
              que transforman la gestión completa del sector salud argentino.
            </p>
            
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <CheckCircle className={styles.benefitIconContent} />
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Gestión Integral de la Salud</h3>
                  <p className={styles.benefitDescription}>Desde consultorios hasta hospitales completos. Soluciones unificadas que integran pacientes, equipamiento, personal y procesos médicos.</p>
                </div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <CheckCircle className={styles.benefitIconContent} />
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Mejora la Experiencia del Paciente</h3>
                  <p className={styles.benefitDescription}>Optimiza flujos de atención, reduce tiempos de espera y mejora la coordinación entre diferentes áreas médicas.</p>
                </div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <CheckCircle className={styles.benefitIconContent} />
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>Digitalización Completa</h3>
                  <p className={styles.benefitDescription}>Historiales electrónicos, turnos digitales, facturación automática y reportes en tiempo real para toda la organización médica.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.statsCard}>
            <h3 className={styles.statsTitle}>Resultados Comprobados</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>40%</div>
                <div className={styles.statLabel}>Mejora eficiencia</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>60%</div>
                <div className={styles.statLabel}>Menos tiempo administrativo</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>95%</div>
                <div className={styles.statLabel}>Reducción errores</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Satisfacción cliente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
