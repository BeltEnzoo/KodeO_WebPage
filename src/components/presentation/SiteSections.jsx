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
          <p className={styles.eyebrow}>Qué hacemos</p>
          <h2>Dos áreas. Una misma visión tecnológica.</h2>
          <p>KodeON trabaja el equipamiento y el software. Una institución puede comprar o mantener un equipo, y también digitalizar la gestión.</p>
        </div>
        <div className={styles.areaGrid}>
          <article className={styles.areaCard}>
            <p className={styles.eyebrow}>Equipamiento médico</p>
            <h3>Venta, mantenimiento y servicio técnico.</h3>
            <p>Para quien necesita adquirir un equipo y para quien ya lo tiene y debe repararlo, prevenir fallas o llevar su historial.</p>
            <Link to="/equipos" className={styles.primary}>Ver soluciones de equipamiento</Link>
          </article>
          <article className={styles.areaCard}>
            <p className={styles.eyebrow}>Desarrollo tecnológico</p>
            <h3>Aplicaciones, sistemas, webs y automatizaciones.</h3>
            <p>Soluciones digitales a medida, además de sistemas propios para equipamiento, consultorios y turnos.</p>
            <Link to="/software" className={styles.primary}>Ver soluciones tecnológicas</Link>
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
          <p className={styles.eyebrow}>Área 1</p>
          <h2>Equipamiento médico</h2>
          <p>Soluciones desde la adquisición hasta el mantenimiento y el soporte técnico. El equipo se acompaña con criterio técnico y con registro de cada intervención.</p>
        </div>
        <div className={styles.cardGrid}>
          {equipmentServices.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className={styles.cardActions}>
                <a href={solutionConsultUrl(item.title)} target="_blank" rel="noopener noreferrer">Consultar</a>
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
          <p className={styles.eyebrow}>Área 2</p>
          <h2>Desarrollo de soluciones digitales</h2>
          <p>Diseñamos y desarrollamos tecnología adaptada a cada proyecto: una aplicación, un sistema, un sitio o una automatización.</p>
        </div>
        <div className={styles.cardGrid}>
          {digitalServices.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className={styles.cardActions}>
                <a href={solutionConsultUrl(item.title)} target="_blank" rel="noopener noreferrer">Consultar</a>
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
          <p className={styles.eyebrow}>Soluciones propias</p>
          <h2>Sistemas que KodeON ya desarrolla.</h2>
          <p>No son ideas sueltas. Son productos en curso, con el alcance que hoy está publicado.</p>
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
                <a href={solutionConsultUrl(product.title)} target="_blank" rel="noopener noreferrer">Consultar</a>
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
          <h2>¿Tenés una idea? La desarrollamos.</h2>
          <p>Cada organización tiene necesidades diferentes. Diseñamos aplicaciones, sistemas y herramientas adaptadas a cada proyecto.</p>
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
          <h2>Tecnología que entiende la realidad del sector salud.</h2>
          <p>
            KodeON combina conocimiento de tecnología, equipamiento médico y desarrollo de software. Eso permite hablar con un hospital, una clínica o un consultorio sobre el equipo, el mantenimiento y el sistema que registra la operación.
          </p>
          <p>
            La especialización nace en salud. También desarrollamos para empresas, profesionales, municipios e instituciones cuando el problema es tecnológico y hay que resolverlo con una solución concreta.
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
          <h2>Equipamiento y software, con el mismo criterio.</h2>
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
            <h2>Equipamiento, service o un sistema. Se puede empezar por cualquiera.</h2>
            <p>Hospital, clínica, consultorio, empresa o municipio: la conversación arranca por la necesidad concreta.</p>
          </div>
          <div className={styles.actions}>
            <Link to="/equipos" className={styles.secondary}>Equipamiento</Link>
            <Link to="/contacto" className={styles.primary}>Hablemos de tu proyecto</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
