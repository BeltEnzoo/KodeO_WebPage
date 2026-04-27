import React from 'react';
import styles from './SuccessCases.module.css';
import logoHM from '../../logos/HM.jpeg';
import logoLEX from '../../logos/LEX.jpeg';
import logoED from '../../logos/ED.jpeg';
import logoZigyzoo from '../../logos/Zigyzoo.jpg';
import logoKINEL from '../../logos/KINEL.jpeg';

const SuccessCases = () => {
  const clients = [
    {
      id: 'hernan',
      name: 'Dr. Hernan Musciatti',
      role: 'Cardiologo',
      mark: 'HM',
      logo: logoHM,
      logoClass: 'logoHm',
    },
    {
      id: 'lex',
      name: 'LEX',
      role: 'Servicios integrales',
      mark: 'LEX',
      logo: logoLEX,
      logoClass: 'logoLex',
    },
    {
      id: 'ged',
      name: 'Ente Descentralizado Dr. Saintout',
      role: 'Institucion de salud',
      mark: 'ED',
      logo: logoED,
      logoClass: 'logoEd',
    },
    {
      id: 'zigyzoo',
      name: 'Zigyzoo',
      role: 'Tu mundo infantil',
      mark: 'ZZ',
      logo: logoZigyzoo,
      logoClass: 'logoZigyzoo',
    },
    {
      id: 'kinel',
      name: 'KINEL',
      role: 'Consultorios',
      mark: 'K',
      logo: logoKINEL,
      logoClass: 'logoKinel',
    }
  ];

  return (
    <section id="clientes" className={styles.successCasesSection}>
      <div className={styles.successCasesContainer}>
        <div className={styles.successCasesHeader}>
          <h2 className={styles.successCasesTitle}>Profesionales y empresas que confían en KodeON</h2>
          <p className={styles.successCasesSubtitle}>
            Algunos clientes y profesionales con los que trabajamos.
          </p>
        </div>
        
        <div className={styles.successCasesGrid}>
          {clients.map((client) => (
            <div key={client.id} className={styles.successCaseCard}>
              <div className={styles.clientMark}>
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={`Logo ${client.name}`}
                    className={`${styles.clientLogo} ${client.logoClass ? styles[client.logoClass] : ''}`}
                  />
                ) : (
                  client.mark
                )}
              </div>
              <div className={styles.clientInfo}>
                <h3 className={styles.caseTitle}>{client.name}</h3>
                <p className={styles.clientRole}>{client.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        <p className={styles.clientsNote}>Trabajamos con instituciones, consultorios y profesionales de distintas especialidades.</p>
      </div>
    </section>
  );
};

export default SuccessCases;

