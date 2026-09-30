import { Link } from 'react-router-dom';
import styles from '../components/presentation/presentation.module.css';
import SuccessCases from '../components/SuccessCases';
import { usePageMeta } from '../components/presentation/usePageMeta';

const slots = [
  { title: 'Capturas de sistemas', text: 'Pantallas de un CRM, de una aplicación Android o de un sitio, cuando estén listas para publicar.' },
  { title: 'Videos y demos', text: 'Recorridos cortos para ver cómo se usa cada solución, sin reemplazar una conversación técnica.' },
  { title: 'Casos de uso', text: 'Descripción del problema y de lo que se construyó, solo cuando el proyecto se pueda contar con claridad.' },
];

function ProjectsPage() {
  usePageMeta(
    'Proyectos | KodeON',
    'Espacio de KodeON para capturas, demos y organizaciones con las que ya trabaja: salud, consultorios, instituciones y otros sectores.'
  );

  return (
    <>
      <header className={styles.pageHero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Proyectos</p>
          <h1>Lo que se puede mostrar, sin inventar el resto.</h1>
          <p className={styles.lead}>
            Este espacio queda preparado para capturas, videos, demos y casos de uso. Hoy publicamos las organizaciones y profesionales con los que KodeON ya trabaja. No hay testimonios ni porcentajes que no estén documentados.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.placeholderGrid}>
            {slots.map((slot) => (
              <article key={slot.title} className={styles.placeholder}>
                <h3>{slot.title}</h3>
                <p>{slot.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SuccessCases />

      <section className={styles.section}>
        <div className={styles.container}>
          <Link to="/contacto" className={styles.primary}>Solicitar información</Link>
        </div>
      </section>
    </>
  );
}

export default ProjectsPage;
