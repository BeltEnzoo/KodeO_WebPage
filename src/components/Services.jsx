import { Wrench, ClipboardCheck, Headphones, ShieldCheck } from 'lucide-react';
import styles from './Services.module.css';
import workshop from '../img/electronica.jpg';

const services = [
  {
    icon: ClipboardCheck,
    title: 'Preventivo',
    text: 'Revisiones planificadas para reducir fallas y alargar la vida útil del equipo.',
  },
  {
    icon: Wrench,
    title: 'Correctivo',
    text: 'Diagnóstico y reparación en campo o taller, con seguimiento hasta el cierre.',
  },
  {
    icon: Headphones,
    title: 'Asesoramiento',
    text: 'Selección de equipos, puesta en marcha y criterios de operación.',
  },
  {
    icon: ShieldCheck,
    title: 'Soporte continuo',
    text: 'Acompañamiento operativo con registro técnico y trazabilidad.',
  },
];

function Services() {
  return (
    <section id="servicios" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Servicio técnico</p>
            <h2 className={styles.title}>Mantenimiento biomédico con criterio técnico</h2>
            <p className={styles.subtitle}>
              Intervenciones sobre hardware médico: electrónica, preventivos y correctivos.
              Cada trabajo queda documentado.
            </p>

            <div className={styles.list}>
              {services.map((service) => (
                <article key={service.title} className={styles.item}>
                  <service.icon className={styles.icon} />
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.media}>
            <img src={workshop} alt="Servicio técnico electrónico KodeON" />
            <p className={styles.caption}>Taller electrónico para equipamiento de salud.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
