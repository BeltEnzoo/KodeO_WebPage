import { Link } from 'react-router-dom';
import styles from './About.module.css';
import clinicalImage from '../img/ecografia.jpg';
import workshopImage from '../img/electronica.jpg';
import fieldImage from '../img/incubadora.jpg';

const stats = [
  { value: '2 años', label: 'de trayectoria' },
  { value: 'Tres frentes', label: 'equipos · service · software' },
  { value: 'Un interlocutor', label: 'por cada proyecto' },
];

const pillars = [
  {
    index: '01',
    title: 'Trato directo',
    text: 'Empresa joven, respuesta ágil. Hablás con quien entiende el equipo y el contexto clínico.',
  },
  {
    index: '02',
    title: 'Oficio biomédico',
    text: 'Preventivo, correctivo y puesta en marcha, en campo o taller, con registro de cada intervención.',
  },
  {
    index: '03',
    title: 'Hardware y software juntos',
    text: 'Trazabilidad, sistemas y sitios para que el trabajo técnico no se corte cuando termina la visita.',
  },
];

function About() {
  return (
    <>
      <section id="nosotros" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>Quiénes somos</p>
              <h2 className={styles.title}>Técnica y software al servicio de la salud</h2>
              <p className={styles.text}>
                KodeON es una empresa joven con dos años de trayectoria.
                Trabajamos con instituciones, consultorios y empresas en el
                equipamiento médico y las plataformas que sostienen su operación.
              </p>
              <p className={styles.text}>
                Integramos venta y puesta en marcha, servicio técnico biomédico
                y desarrollo de software. Un mismo criterio: responsabilidad
                técnica y soluciones que se pueden usar de verdad.
              </p>
              <div className={styles.stats}>
                {stats.map((stat) => (
                  <div key={stat.value}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.media}>
              <figure className={styles.shotWorkshop}>
                <img
                  src={workshopImage}
                  alt="Taller electrónico KodeON"
                />
              </figure>
              <figure className={styles.shotField}>
                <img
                  src={fieldImage}
                  alt="Service de equipamiento hospitalario"
                />
              </figure>
              <figure className={styles.shotClinical}>
                <img
                  src={clinicalImage}
                  alt="Equipamiento de diagnóstico en operación"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.approach}>
        <div className={styles.container}>
          <div className={styles.approachHeader}>
            <div>
              <p className={styles.approachEyebrow}>Cómo trabajamos</p>
              <h3 className={styles.approachTitle}>La operación no se fragmenta</h3>
            </div>
            <p className={styles.approachLead}>
              Un interlocutor para equipos, mantenimiento y plataformas digitales.
              El mismo rigor técnico en cada frente.
            </p>
          </div>

          <div className={styles.pillars}>
            {pillars.map((pillar) => (
              <article key={pillar.index} className={styles.pillar}>
                <span className={styles.pillarIndex}>{pillar.index}</span>
                <h4>{pillar.title}</h4>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>

          <div className={styles.cta}>
            <p>¿Hay un equipo, un service o un desarrollo por resolver? Hablemos.</p>
            <div className={styles.actions}>
              <Link to="/contacto" className={styles.primary}>Contacto</Link>
              <Link to="/servicios" className={styles.secondary}>Ver servicios</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
