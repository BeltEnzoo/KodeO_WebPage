import React from 'react';
import { CheckCircle, TrendingUp, Users, Clock } from 'lucide-react';
import styles from './SuccessCases.module.css';

const SuccessCases = () => {
  const cases = [
    {
      title: "Digitalización Completa de Clínica Privada",
      type: "Clínica",
      location: "Buenos Aires",
      description: "Implementación integral de software médico para una clínica con 50+ profesionales.",
      results: [
        "40% reducción en tiempo administrativo",
        "60% mejora en gestión de turnos",
        "100% digitalización de historiales clínicos"
      ],
      icon: <Users className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: "Sistema de Gestión Hospitalaria",
      type: "Hospital",
      location: "Córdoba",
      description: "Desarrollo de plataforma completa para gestión de equipamiento médico y flujo hospitalario.",
      results: [
        "95% reducción de errores en inventario",
        "30% optimización de recursos",
        "Integración con 5 sistemas existentes"
      ],
      icon: <TrendingUp className="w-6 h-6" />,
      color: "green"
    },
    {
      title: "Software para Red de Consultorios",
      type: "Consultorios",
      location: "Mendoza",
      description: "Solución unificada para red de 12 consultorios médicos con facturación centralizada.",
      results: [
        "50% mejora en eficiencia operativa",
        "Unificación de datos en tiempo real",
        "Implementación en 3 meses"
      ],
      icon: <CheckCircle className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: "Gestión de Farmacia Hospitalaria",
      type: "Farmacia",
      location: "Rosario",
      description: "Sistema especializado para control de stock, recetas digitales y farmacovigilancia.",
      results: [
        "80% reducción en medicamentos vencidos",
        "Control de interacciones medicamentosas",
        "Reportes automáticos para auditoría"
      ],
      icon: <Clock className="w-6 h-6" />,
      color: "green"
    }
  ];

  return (
    <section id="casos-exito" className={styles.successCasesSection}>
      <div className={styles.successCasesContainer}>
        <div className={styles.successCasesHeader}>
          <h2 className={styles.successCasesTitle}>Casos de Éxito</h2>
          <p className={styles.successCasesSubtitle}>
            Historias reales de instituciones que transformaron su gestión con KodeON
          </p>
        </div>
        
        <div className={styles.successCasesGrid}>
          {cases.map((caseItem, index) => (
            <div key={index} className={styles.successCaseCard}>
              <div className={`${styles.caseIcon} ${styles[`caseIcon${caseItem.color.charAt(0).toUpperCase() + caseItem.color.slice(1)}`]}`}>
                {caseItem.icon}
              </div>
              
              <div className={styles.caseHeader}>
                <div className={styles.caseType}>
                  <span className={styles.caseTypeBadge}>{caseItem.type}</span>
                  <span className={styles.caseLocation}>{caseItem.location}</span>
                </div>
                <h3 className={styles.caseTitle}>{caseItem.title}</h3>
              </div>
              
              <p className={styles.caseDescription}>{caseItem.description}</p>
              
              <div className={styles.caseResults}>
                <h4 className={styles.resultsTitle}>Resultados:</h4>
                <ul className={styles.resultsList}>
                  {caseItem.results.map((result, resultIndex) => (
                    <li key={resultIndex} className={styles.resultItem}>
                      <CheckCircle className={styles.resultIcon} />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.successCasesCta}>
          <p className={styles.ctaText}>
            ¿Quieres ser el próximo caso de éxito?
          </p>
          <a 
            href="#contacto" 
            className={styles.ctaButton}
          >
            Contáctanos Ahora
          </a>
        </div>
      </div>
    </section>
  );
};

export default SuccessCases;

