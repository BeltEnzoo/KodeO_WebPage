import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './Contact.module.css';

function Contact() {
  return (
    <section id="contacto" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div>
            <p className={styles.eyebrow}>Contacto</p>
            <h2 className={styles.title}>Contanos qué necesitás</h2>
            <p className={styles.subtitle}>
              Servicio técnico, equipos, asesoramiento o software. Respondemos con una propuesta concreta.
            </p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Phone className={styles.icon} />
                <div>
                  <span>WhatsApp</span>
                  <strong>+54 9 2944 36-9647</strong>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Mail className={styles.icon} />
                <div>
                  <span>Email</span>
                  <strong>on.kode.soluciones@gmail.com</strong>
                </div>
              </div>
              <div className={styles.infoItem}>
                <MapPin className={styles.icon} />
                <div>
                  <span>Ubicación</span>
                  <strong>Buenos Aires, Argentina</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <h3>¿Por dónde empezamos?</h3>
            <p>
              Contanos si necesitás soporte técnico, un equipo médico, una plataforma o una web
              profesional. Coordinamos por WhatsApp o email.
            </p>
            <div className={styles.actions}>
              <a
                href="https://wa.me/5492944369647?text=Hola%2C%20quiero%20consultar%20por%20servicios%20de%20KodeON"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primary}
              >
                Escribir por WhatsApp
              </a>
              <a
                href="mailto:on.kode.soluciones@gmail.com?subject=Consulta%20KodeON"
                className={styles.secondary}
              >
                Enviar email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
