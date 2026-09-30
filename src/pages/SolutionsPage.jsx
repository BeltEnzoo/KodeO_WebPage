import { Link } from 'react-router-dom';
import styles from '../components/presentation/presentation.module.css';
import { AreaSplit, DigitalSection, EquipmentSection, ProductsSection } from '../components/presentation/SiteSections';
import { usePageMeta } from '../components/presentation/usePageMeta';

function SolutionsPage() {
  usePageMeta(
    'Soluciones | KodeON',
    'Equipamiento médico, servicio técnico, aplicaciones, sistemas web, páginas y automatizaciones. KodeON trabaja hardware y software.'
  );

  return (
    <>
      <header className={styles.pageHero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Soluciones</p>
          <h1>Equipamiento médico y desarrollo, en el mismo lugar.</h1>
          <p className={styles.lead}>
            Una institución puede necesitar un equipo, un service o un sistema. KodeON cubre las tres conversaciones.
          </p>
          <div className={styles.actions}>
            <a href="#equipamiento" className={styles.primary}>Equipamiento</a>
            <a href="#desarrollo" className={styles.secondary}>Desarrollo</a>
            <Link to="/contacto" className={styles.secondary}>Contacto</Link>
          </div>
        </div>
      </header>
      <AreaSplit />
      <EquipmentSection />
      <DigitalSection />
      <ProductsSection />
    </>
  );
}

export default SolutionsPage;
