import ContactPanel from '../components/presentation/ContactPanel';
import { usePageMeta } from '../components/presentation/usePageMeta';
import styles from '../components/presentation/presentation.module.css';

const answers = [
  {
    q: '¿Solo hacen software?',
    a: 'No. KodeON vende y da servicio técnico de equipamiento médico, y también desarrolla aplicaciones, sistemas y páginas web.',
  },
  {
    q: '¿El service incluye preventivo y correctivo?',
    a: 'Sí. Hay revisiones planificadas y reparación en campo o taller, con el trabajo documentado.',
  },
  {
    q: '¿Cómo empieza un proyecto?',
    a: 'Con una conversación por WhatsApp, email o el formulario. Puede ser un equipo, un mantenimiento o un desarrollo.',
  },
];

function ContactPage() {
  usePageMeta(
    'Contacto | KodeON',
    'Contactá a KodeON por WhatsApp, email o formulario para hablar de un sistema, una aplicación o una automatización.'
  );

  return (
    <>
      <ContactPanel />
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Antes de escribir</p>
            <h2>Tres respuestas cortas.</h2>
          </div>
          <div className={styles.cardGrid}>
            {answers.map((item) => (
              <article key={item.q} className={styles.card}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
