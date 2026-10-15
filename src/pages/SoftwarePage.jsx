import styles from '../components/presentation/presentation.module.css';
import { DigitalSection, ProductsSection } from '../components/presentation/SiteSections';
import { usePageMeta } from '../components/presentation/usePageMeta';
import { Link } from 'react-router-dom';

function SoftwarePage() {
  usePageMeta(
    'Desarrollo de software y aplicaciones | KodeON',
    'Aplicaciones Android, sistemas web, páginas, automatizaciones e integraciones. Sistemas propios para equipamiento, consultorios y turnos.'
  );

  return (
    <>
      <header className={styles.pageHero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Desarrollo de software</p>
          <h1>Aplicaciones, sistemas y sitios para instituciones de salud.</h1>
          <p className={styles.lead}>Android, sistemas web, sitios institucionales y los sistemas propios de gestión de equipos, consultorios y turnos.</p>
          <Link to="/contacto" className={styles.primary}>Solicitar información</Link>
        </div>
      </header>
      <DigitalSection />
      <ProductsSection />
    </>
  );
}

export default SoftwarePage;
