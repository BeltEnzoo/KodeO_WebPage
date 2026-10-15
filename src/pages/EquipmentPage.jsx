import styles from '../components/presentation/presentation.module.css';
import { EquipmentSection } from '../components/presentation/SiteSections';
import { usePageMeta } from '../components/presentation/usePageMeta';
import { Link } from 'react-router-dom';

function EquipmentPage() {
  usePageMeta(
    'Equipamiento médico y servicio técnico | KodeON',
    'Venta, puesta en marcha, mantenimiento preventivo y correctivo, diagnóstico y gestión de equipamiento médico.'
  );

  return (
    <>
      <header className={styles.pageHero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Equipamiento médico</p>
          <h1>Venta, service y seguimiento del equipamiento.</h1>
          <p className={styles.lead}>Para instituciones que evalúan una compra y para las que necesitan mantener, reparar o registrar el equipamiento que ya está en servicio.</p>
          <Link to="/contacto" className={styles.primary}>Solicitar información técnica</Link>
        </div>
      </header>
      <EquipmentSection />
    </>
  );
}

export default EquipmentPage;
