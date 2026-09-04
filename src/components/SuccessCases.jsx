import { useEffect, useId, useState } from 'react';
import { X } from 'lucide-react';
import styles from './SuccessCases.module.css';
import logoHM from '../../logos/HM.jpeg';
import logoLEX from '../../logos/LEX.jpeg';
import logoED from '../../logos/ED.jpeg';
import logoZigyzoo from '../../logos/Zigyzoo.jpg';
import logoKINEL from '../../logos/KINEL.jpeg';
import clientMusciatti from '../img/Clientes - 1.png';
import clientChaves from '../img/Clientes - 2.png';
import clientGym from '../img/Clientes - 3.png';
import clientSuria from '../img/Clientes - 4.png';
import clientLex from '../img/Clientes - 5.png';
import clientZigyzoo from '../img/Clientes - 6.png';
import clientKinel from '../img/Clientes - 7.png';
import clientEnte from '../img/Clientes - 8.png';

const clients = [
  {
    name: 'Hernán Musciatti',
    role: 'Cardiólogo',
    preview: logoHM,
    full: clientMusciatti,
  },
  {
    name: 'Municipio de Chaves',
    role: 'Gestión municipal',
    preview: clientChaves,
    full: clientChaves,
  },
  {
    name: 'Pablo Suria',
    role: 'Odontólogo',
    preview: clientSuria,
    full: clientSuria,
  },
  {
    name: 'LEX',
    role: 'Instituciones sanitarias',
    preview: logoLEX,
    full: clientLex,
  },
  {
    name: 'KINEL',
    role: 'Consultorios',
    preview: logoKINEL,
    full: clientKinel,
  },
  {
    name: 'Ente Descentralizado',
    role: 'Hospital',
    preview: logoED,
    full: clientEnte,
  },
  {
    name: 'Gym Punto de Oro',
    role: 'Gimnasio',
    preview: clientGym,
    full: clientGym,
  },
  {
    name: 'Zigyzoo',
    role: 'Comercio',
    preview: logoZigyzoo,
    full: clientZigyzoo,
  },
];

function SuccessCases() {
  const [active, setActive] = useState(null);
  const titleId = useId();

  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActive(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);

  return (
    <section id="clientes" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Clientes</p>
          <h2 className={styles.title}>Con quiénes trabajamos</h2>
          <p className={styles.subtitle}>
            Profesionales, consultorios, municipios e instituciones de salud.
            Tocá una tarjeta para verla completa.
          </p>
        </div>

        <div className={styles.grid}>
          {clients.map((client) => (
            <button
              key={client.name}
              type="button"
              className={styles.card}
              onClick={() => setActive(client)}
              aria-label={`Ampliar ${client.name}`}
            >
              <div className={styles.media}>
                <img src={client.preview} alt="" />
              </div>
              <div className={styles.body}>
                <h3>{client.name}</h3>
                <p>{client.role}</p>
                <span className={styles.hint}>Ver completo</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setActive(null)}
        >
          <div
            className={styles.lightboxPanel}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.lightboxTop}>
              <div>
                <h3 id={titleId}>{active.name}</h3>
                <p>{active.role}</p>
              </div>
              <button
                type="button"
                className={styles.close}
                onClick={() => setActive(null)}
                aria-label="Cerrar"
              >
                <X />
              </button>
            </div>
            <div className={styles.lightboxMedia}>
              <img src={active.full} alt={active.name} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SuccessCases;
