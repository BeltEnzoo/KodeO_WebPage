import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import heroImage from '../img/ecografia.jpg';

const highlights = [
  {
    to: '/equipos',
    title: 'Equipos',
    text: 'Venta, service y asesoramiento sobre equipamiento médico.',
  },
  {
    to: '/servicios',
    title: 'Servicio técnico',
    text: 'Mantenimiento preventivo y correctivo en campo o taller.',
  },
  {
    to: '/software',
    title: 'Software',
    text: 'Trazabilidad de equipos, sistemas a medida y sitios web.',
  },
  {
    to: '/nosotros',
    title: 'Nosotros',
    text: 'Enzo Beltrán: técnico en electromedicina y desarrollador web.',
  },
];

function HomePage() {
  return (
    <>
      <section className={styles.intro}>
        <img src={heroImage} alt="" className={styles.introMedia} aria-hidden="true" />
        <div className={styles.introOverlay} />
        <div className={styles.introContainer}>
          <p className={styles.eyebrow}>KodeON · Salud</p>
          <h1 className={styles.title}>
            Equipamiento médico, servicio técnico y software
          </h1>
          <p className={styles.description}>
            Soluciones concretas para instituciones y profesionales de la salud.
          </p>
          <div className={styles.actions}>
            <Link to="/contacto" className={styles.primary}>Contacto</Link>
            <Link to="/servicios" className={styles.secondary}>Ver servicios</Link>
          </div>
        </div>
      </section>

      <section className={styles.sections}>
        <div className={styles.container}>
          <div className={styles.sectionsHeader}>
            <h2>Explorar el sitio</h2>
            <p>Cada área en su propia página, más clara y fácil de recorrer.</p>
          </div>
          <div className={styles.grid}>
            {highlights.map((item) => (
              <Link key={item.to} to={item.to} className={styles.card}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>Ver más</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
