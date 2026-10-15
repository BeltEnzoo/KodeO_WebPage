import styles from '../components/presentation/presentation.module.css';
import ContactPanel from '../components/presentation/ContactPanel';
import {
  AreaSplit,
  ClosingCta,
  CustomSection,
  ProductsSection,
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
            <p className={styles.eyebrow}>KodeON Soluciones</p>
            <h1>Tecnología al servicio de la salud.</h1>
            <ul className={styles.heroLines}>
              <li>
                <span>Desarrollo</span>
                Páginas web, sistemas CRM y aplicaciones Android.
              </li>
              <li>
                <span>Equipamiento médico</span>
                Venta y servicio técnico.
              </li>
            </ul>
            <div className={styles.actions}>
              <a href={QUOTE_URL} className={styles.primary} target="_blank" rel="noopener noreferrer">Solicitar presupuesto</a>
              <a href="/contacto" className={styles.secondary}>Consultar por un servicio</a>
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
      <ProductsSection />
      <CustomSection />

      <ClosingCta />
      <ContactPanel compact />
    </>
  );
}

export default HomePage;
