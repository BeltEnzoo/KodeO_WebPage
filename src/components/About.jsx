import { Linkedin } from 'lucide-react';
import styles from './About.module.css';
import workshopImage from '../img/electronica.jpg';

const aboutImage = new URL('../img/Presentación Enzo.png', import.meta.url).href;
const linkedInUrl = 'https://www.linkedin.com/in/enzo-gonzalo-beltr%C3%A1n-a04b39207/';

function About() {
  return (
    <section id="nosotros" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Quiénes somos</p>
            <h2 className={styles.title}>Experiencia técnica al servicio de la salud</h2>
            <p className={styles.text}>
              Me llamo Enzo Beltrán. Soy técnico en electromedicina y desarrollador web.
              Desde KodeON combino servicio técnico biomédico, asesoramiento y desarrollo
              de software para instituciones, consultorios y empresas.
            </p>
            <p className={styles.text}>
              El enfoque es concreto: equipos, mantenimiento y plataformas digitales que
              sostienen la operación día a día, con criterio clínico y responsabilidad técnica.
            </p>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkedin}
            >
              <Linkedin className={styles.linkedinIcon} />
              Ver perfil en LinkedIn
            </a>
            <div className={styles.stats}>
              <div>
                <strong>Servicio técnico</strong>
                <span>Preventivo y correctivo</span>
              </div>
              <div>
                <strong>Equipamiento</strong>
                <span>Venta y puesta en marcha</span>
              </div>
              <div>
                <strong>Software</strong>
                <span>Desarrollo y sitios web</span>
              </div>
            </div>
          </div>

          <div className={styles.media}>
            <img src={aboutImage} alt="Enzo Beltrán - KodeON" className={styles.portrait} />
            <img src={workshopImage} alt="Taller electrónico KodeON" className={styles.workshop} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
