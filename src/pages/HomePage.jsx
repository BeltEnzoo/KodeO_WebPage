import { Link } from 'react-router-dom';
import styles from '../components/presentation/presentation.module.css';
import SystemVisual from '../components/presentation/SystemVisual';
import ContactPanel from '../components/presentation/ContactPanel';
import {
  AreaSplit,
  ClosingCta,
  CustomSection,
  DigitalSection,
  EquipmentSection,
  HealthSection,
  ProductsSection,
  WhySection,
} from '../components/presentation/SiteSections';
import { usePageMeta } from '../components/presentation/usePageMeta';
import logoHM from '../../logos/HM.jpeg';
import logoLEX from '../../logos/LEX.jpeg';
import logoED from '../../logos/ED.jpeg';
import logoZigyzoo from '../../logos/Zigyzoo.jpg';
import logoKINEL from '../../logos/KINEL.jpeg';

const marks = [
  { src: logoHM, name: 'Hernán Musciatti' },
  { src: logoLEX, name: 'LEX' },
  { src: logoED, name: 'Ente Descentralizado' },
  { src: logoZigyzoo, name: 'Zigyzoo' },
  { src: logoKINEL, name: 'KINEL' },
];

function HomePage() {
  usePageMeta(
    'KodeON | Equipamiento médico, servicio técnico y desarrollo',
    'KodeON vende y mantiene equipamiento médico, y desarrolla aplicaciones, sistemas, páginas web y automatizaciones para hospitales, clínicas, consultorios e instituciones.'
  );

  return (
    <>
      <section className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>KodeON · Soluciones tecnológicas</p>
            <h1>Tecnología, equipamiento y desarrollo para transformar procesos.</h1>
            <p className={styles.lead}>
              Desde el servicio técnico y la gestión de equipamiento médico hasta el desarrollo de aplicaciones, sistemas y soluciones a medida.
            </p>
            <div className={styles.actions}>
              <a href="#areas" className={styles.primary}>Conocé nuestras soluciones</a>
              <Link to="/contacto" className={styles.secondary}>Hablemos de tu proyecto</Link>
            </div>
          </div>
          <SystemVisual />
        </div>
      </section>

      <AreaSplit />
      <EquipmentSection />
      <DigitalSection />
      <ProductsSection />
      <CustomSection />
      <HealthSection />
      <WhySection />

      <section id="proyectos" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Proyectos</p>
            <h2>Espacio para sistemas, equipos y trabajos reales.</h2>
            <p>
              Acá van a sumarse capturas, aplicaciones, sitios y trabajos técnicos cuando se puedan mostrar. Hoy publicamos organizaciones y profesionales con los que KodeON ya trabaja.
            </p>
          </div>
          <div className={styles.logoStrip}>
            {marks.map((mark) => (
              <Link key={mark.name} to="/proyectos">
                <img src={mark.src} alt={`Logo de ${mark.name}`} />
                <span>{mark.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
      <ContactPanel compact />
    </>
  );
}

export default HomePage;
