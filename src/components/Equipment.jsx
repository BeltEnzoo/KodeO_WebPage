import styles from './Equipment.module.css';
import incubadora from '../img/incubadora.jpg';
import ecografia from '../img/ecografia.jpg';
import rx from '../img/rx.jpg';

const items = [
  {
    image: ecografia,
    title: 'Diagnóstico por imágenes',
    text: 'Ecógrafos y equipos de ultrasonido.',
  },
  {
    image: incubadora,
    title: 'Equipamiento hospitalario',
    text: 'Incubadoras y dispositivos clínicos.',
  },
  {
    image: rx,
    title: 'Electrónica biomédica',
    text: 'Reparación y recuperación de equipos.',
  },
];

const tasks = [
  'Venta y puesta en marcha',
  'Service preventivo y correctivo',
  'Asesoramiento técnico sobre equipamiento',
  'Trazabilidad de equipos con software propio',
];

function Equipment() {
  return (
    <section id="equipos" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Equipamiento médico</p>
            <h2 className={styles.title}>Venta, service y asesoramiento</h2>
            <p className={styles.subtitle}>
              Acompañamos la operación de tu institución con criterios técnicos claros,
              desde la compra del equipo hasta su mantenimiento y seguimiento.
            </p>
          </div>

          <ul className={styles.tasks}>
            {tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </div>

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.title} className={styles.item}>
              <div className={styles.imageWrap}>
                <img src={item.image} alt={item.title} className={styles.image} />
              </div>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemText}>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Equipment;
