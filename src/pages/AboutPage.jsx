import { Link } from 'react-router-dom';
import styles from '../components/presentation/presentation.module.css';
import { usePageMeta } from '../components/presentation/usePageMeta';
import { customSteps, reasons } from '../components/presentation/content';

function AboutPage() {
  usePageMeta(
    'Nosotros | KodeON',
    'KodeON desarrolla tecnología para resolver necesidades reales, con especial conocimiento de procesos del sector salud y capacidad de construir soluciones a medida.'
  );

  return (
    <>
      <header className={styles.pageHero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Nosotros</p>
          <h1>Tecnología pensada para resolver problemas reales.</h1>
          <p className={styles.lead}>
            No vendemos una herramienta por venderla. Primero entendemos qué hay que resolver y después desarrollamos el sistema, la aplicación o la automatización que corresponde.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={`${styles.container} ${styles.split}`}>
          <div className={styles.prose}>
            <h2>Qué es KodeON</h2>
            <p>
              KodeON trabaja dos frentes: equipamiento médico (venta, puesta en marcha y servicio técnico) y desarrollo de software, aplicaciones y sitios. El trabajo es con hospitales, clínicas, consultorios, empresas e instituciones.
            </p>
            <p>
              El punto de partida es el sector salud: experiencia en tecnología hospitalaria y conocimiento de equipamiento, gestión y atención. Ese mismo oficio se aplica cuando el cliente es una empresa o un municipio.
            </p>
          </div>
          <div className={styles.prose}>
            <h2>Tecnología que entiende el sector salud</h2>
            <p>
              Hablar con un hospital o un consultorio exige conocer cómo se usa un equipo, cómo se organiza un turno y qué información tiene que quedar registrada. KodeON se apoya en esa experiencia para diseñar software que se pueda usar en la práctica.
            </p>
            <p>
              No publicamos certificaciones ni cifras que no podamos mostrar. La confianza tiene que salir del alcance del trabajo, del proceso y de una conversación directa.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Por qué KodeON</p>
            <h2>Cinco ideas que sostienen cada proyecto.</h2>
          </div>
          <div className={styles.reasonGrid}>
            {reasons.map((item) => (
              <article key={item.title} className={styles.reason}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Proceso</p>
            <h2>Cómo se trabaja con una institución.</h2>
          </div>
          <div className={`${styles.stepGrid} ${styles.workGrid}`}>
            {customSteps.map((step) => (
              <article key={step.n} className={styles.step}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className={styles.ctaRow} style={{ marginTop: '1.5rem' }}>
            <Link to="/contacto" className={styles.primary}>Hablemos de tu proyecto</Link>
            <Link to="/soluciones" className={styles.secondary}>Ver soluciones</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
