import styles from '../components/presentation/presentation.module.css';
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
import { QUOTE_URL } from '../components/presentation/content';
import ecografia from '../img/ecografia.jpg';
import incubadora from '../img/incubadora.jpg';
import rx from '../img/rx.jpg';

function HomePage() {
  usePageMeta(
    'KodeON | Equipamiento médico, servicio técnico y sistemas para la salud',
    'KodeON comercializa y mantiene equipamiento médico, y desarrolla aplicaciones Android, sistemas web y sitios para hospitales, clínicas y consultorios.'
  );

  return (
    <>
      <section className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Soluciones para la salud</p>
            <h1>Equipamiento médico y tecnología para instituciones de salud.</h1>
            <p className={styles.lead}>
              KodeON comercializa y mantiene equipamiento médico, y desarrolla aplicaciones, sistemas web y sitios para hospitales, clínicas y consultorios.
            </p>
            <div className={styles.actions}>
              <a href={QUOTE_URL} className={styles.primary} target="_blank" rel="noopener noreferrer">Solicitar presupuesto</a>
              <a href="#areas" className={styles.secondary}>Conozca las soluciones</a>
            </div>
          </div>
          <div className={styles.heroPhotos}>
            <img src={ecografia} alt="Ecógrafo en un entorno clínico" />
            <img src={incubadora} alt="Incubadora de uso hospitalario" />
            <img src={rx} alt="Trabajo de servicio técnico sobre equipamiento médico" />
          </div>
        </div>
      </section>

      <AreaSplit />
      <EquipmentSection />
      <DigitalSection />
      <ProductsSection />
      <CustomSection />
      <HealthSection />
      <WhySection />

      <ClosingCta />
      <ContactPanel compact />
    </>
  );
}

export default HomePage;
