import { Link } from 'react-router-dom';
import styles from './presentation.module.css';
import {
  customSteps,
  digitalServices,
  equipmentLines,
  equipmentServices,
  ownProducts,
  reasons,
  solutionConsultUrl,
} from './content';
import ecografia from '../../img/ecografia.jpg';
import incubadora from '../../img/incubadora.jpg';
import rx from '../../img/rx.jpg';

const photos = [
  { src: ecografia, alt: 'Ecógrafo en operación', caption: 'Diagnóstico por imágenes' },
  { src: incubadora, alt: 'Incubadora hospitalaria', caption: 'Equipamiento hospitalario' },
  { src: rx, alt: 'Trabajo de electrónica biomédica', caption: 'Electrónica biomédica' },
];

export function AreaSplit() {
  return (
    <section id="areas" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Líneas de trabajo</p>
          <h2>Dos ofertas, con alcance distinto.</h2>
        </div>
        <div className={styles.areaGrid}>
          <article className={styles.areaCard}>
            <p className={styles.eyebrow}>Desarrollo</p>
            <h3>Páginas web, sistemas CRM y aplicaciones Android.</h3>
            <p>Sitios institucionales, gestión de consultorio y turnos, y aplicaciones para el teléfono del profesional o del personal.</p>
            <Link to="/software" className={styles.primary}>Ver desarrollo</Link>
          </article>
          <article className={styles.areaCard}>
            <p className={styles.eyebrow}>Equipamiento médico</p>
            <h3>Venta y servicio técnico.</h3>
            <p>Comercialización, puesta en marcha, diagnóstico, mantenimiento preventivo y correctivo.</p>
            <Link to="/equipos" className={styles.primary}>Ver equipamiento</Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export function EquipmentSection() {
  return (
    <section id="equipamiento" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Electromedicina</p>
          <h2>Equipamiento médico y servicio técnico</h2>
          <p>Acompañamos a la institución desde la consulta comercial hasta el mantenimiento. El respaldo técnico cubre equipos por adquirir y equipos que ya están en servicio.</p>
        </div>
        <div className={styles.cardGrid}>
          {equipmentServices.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className={styles.cardActions}>
                <a href={solutionConsultUrl(item.title)} target="_blank" rel="noopener noreferrer">Solicitar información</a>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.photoRow}>
          {photos.map((photo) => (
            <figure key={photo.caption}>
              <img src={photo.src} alt={photo.alt} />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
        <ul className={styles.lineList}>
          {equipmentLines.map((line) => (
            <li key={line.title}><strong>{line.title}.</strong> {line.text}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function DigitalSection() {
  return (
    <section id="desarrollo" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Desarrollo</p>
          <h2>Aplicaciones y sistemas para la salud</h2>
          <p>Desarrollamos la herramienta digital que la institución necesita: una aplicación Android, un sistema web, un sitio o la automatización de un proceso de atención o de gestión.</p>
        </div>
        <div className={styles.cardGrid}>
          {digitalServices.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className={styles.cardActions}>
                <a href={solutionConsultUrl(item.title)} target="_blank" rel="noopener noreferrer">Solicitar información</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductsSection() {
  return (
    <section id="productos" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Sistemas propios</p>
          <h2>Soluciones de gestión desarrolladas por KodeON.</h2>
          <p>Tres sistemas en uso dentro de la oferta de software para salud. El detalle publicado es el alcance actual de cada uno.</p>
        </div>
        <div className={styles.cardGrid}>
          {ownProducts.map((product) => (
            <article key={product.id} id={product.id} className={styles.card}>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
              <ul className={styles.featureList}>
                {product.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className={styles.cardActions}>
                <a href={solutionConsultUrl(product.title)} target="_blank" rel="noopener noreferrer">Solicitar información</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomSection() {
  return (
    <section id="a-medida" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>A medida</p>
          <h2>Si el proceso es propio, el sistema también.</h2>
          <p>Hospitales, clínicas y consultorios no trabajan todos igual. El desarrollo parte de esa forma de trabajar y llega hasta la puesta en marcha.</p>
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
      </div>
    </section>
  );
}

export function HealthSection() {
  return (
    <section id="salud" className={styles.section}>
      <div className={`${styles.container} ${styles.split}`}>
        <div className={styles.prose}>
          <p className={styles.eyebrow}>Salud</p>
          <h2>Un interlocutor para el equipo y para el sistema.</h2>
          <p>
            KodeON reúne electromedicina y desarrollo de software. La institución puede consultar la compra o la reparación de un equipo y, en la misma conversación, la aplicación o el sitio que ordena su gestión.
          </p>
          <p>
            El trabajo está pensado para hospitales, clínicas, centros de salud y consultorios. Cuando el proyecto lo requiere, el desarrollo también alcanza a empresas e instituciones públicas del área de salud.
          </p>
        </div>
        <div className={styles.audienceGrid}>
          <article className={styles.reason}><h3>Adquirir un equipo</h3><p>Asesoramiento, venta y puesta en marcha.</p></article>
          <article className={styles.reason}><h3>Mantenerlo</h3><p>Preventivo, correctivo y diagnóstico, en campo o taller.</p></article>
          <article className={styles.reason}><h3>Gestionarlo</h3><p>Historial, estado e intervenciones en un sistema propio.</p></article>
          <article className={styles.reason}><h3>Digitalizar</h3><p>Consultorio, turnos, aplicaciones y sitios a medida.</p></article>
        </div>
      </div>
    </section>
  );
}

export function WhySection() {
  return (
    <section id="por-que" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Por qué KodeON</p>
          <h2>Criterio técnico en el equipo y en el software.</h2>
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
  );
}

export function ClosingCta() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.ctaBand}>
          <div>
            <h2>Solicite información técnica o comercial.</h2>
            <p>Equipamiento, servicio técnico, una aplicación Android o un sistema de gestión para su institución.</p>
          </div>
          <div className={styles.actions}>
            <Link to="/equipos" className={styles.secondary}>Equipamiento</Link>
            <Link to="/contacto" className={styles.primary}>Contactar a KodeON</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
