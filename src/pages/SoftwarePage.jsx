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
          <p className={styles.eyebrow}>Desarrollo tecnológico</p>
          <h1>Aplicaciones, sistemas y sitios a medida.</h1>
          <p className={styles.lead}>Además de los desarrollos propios para salud, KodeON construye la herramienta que el proyecto necesita.</p>
          <Link to="/contacto" className={styles.primary}>Consultar un desarrollo</Link>
        </div>
      </header>
      <DigitalSection />
      <ProductsSection />
    </>
  );
}

export default SoftwarePage;
