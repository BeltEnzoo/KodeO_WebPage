import { Link } from 'react-router-dom';
import styles from './presentation.module.css';
import { solutionConsultUrl, solutions } from './content';

function SolutionsGrid({ filter = 'all', heading = 'Soluciones', intro }) {
  const items = filter === 'all'
    ? solutions
    : solutions.filter((item) => item.group === filter || item.id === filter);

  return (
    <section id="soluciones" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Qué hacemos</p>
          <h2>{heading}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
        <div className={styles.cardGrid}>
          {items.map((item) => (
            <article key={item.id} id={item.id} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className={styles.cardActions}>
                <Link to={`/soluciones#${item.id}`}>Conocer solución</Link>
                <a href={solutionConsultUrl(item.title)} target="_blank" rel="noopener noreferrer">Consultar</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionsGrid;
