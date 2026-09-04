import styles from './Products.module.css';

const products = [
  {
    title: 'Trazabilidad de equipos',
    text: 'Software propio para registrar intervenciones, estado operativo e historial del equipamiento médico.',
  },
  {
    title: 'Software a medida',
    text: 'Sistemas de gestión para consultorios, clínicas y operaciones técnicas.',
  },
  {
    title: 'Sitios web',
    text: 'Presencia digital clara y profesional para instituciones y empresas de salud.',
  },
  {
    title: 'KodeON Consultorio',
    text: 'Turnos, historias clínicas y administración para consultorios privados.',
  },
];

function Products() {
  return (
    <section id="productos" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Software</p>
          <h2 className={styles.title}>Herramientas digitales propias</h2>
          <p className={styles.subtitle}>
            Desarrollamos plataformas que ordenan procesos: desde la gestión del consultorio
            hasta la trazabilidad del equipamiento médico.
          </p>
        </div>

        <div className={styles.grid}>
          {products.map((product, index) => (
            <article key={product.title} className={styles.item}>
              <span className={styles.index}>0{index + 1}</span>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
            </article>
          ))}
        </div>

        <a
          href="https://wa.me/5492944369647?text=Hola%2C%20quiero%20consultar%20por%20desarrollo%20o%20software"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          Consultar software
        </a>
      </div>
    </section>
  );
}

export default Products;
