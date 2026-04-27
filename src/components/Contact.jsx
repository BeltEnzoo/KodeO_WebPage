import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <section id="contacto" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h2 className={styles.contactTitle}>¿Listo para ordenar tu operación técnica y digital?</h2>
          <p className={styles.contactSubtitle}>
            Te ayudamos con software de gestión y mantenimiento preventivo/correctivo de equipamiento médico.
            Podemos empezar por una demo o por una necesidad técnica puntual.
          </p>
        </div>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactInfoSection}>
            <h3>Información de contacto</h3>
            
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.contactIconBlue}`}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={styles.contactLabel}>WhatsApp business</div>
                  <div className={styles.contactValue}>+54 9 2944 36-9647</div>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.contactIconGreen}`}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>on.kode.soluciones@gmail.com</div>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.contactIconBlue}`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={styles.contactLabel}>Ubicación</div>
                  <div className={styles.contactValue}>Buenos Aires, Argentina</div>
                </div>
              </div>
            </div>

            <div className={styles.socialSection}>
              <h4 className={styles.socialTitle}>Síguenos en redes sociales</h4>
              <div className={styles.socialLinks}>
                <a 
                  href="https://www.instagram.com/kode.on.soluciones/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Instagram de KodeON"
                >
                  <Instagram className={styles.socialIcon} />
                  <span>@kode.on.soluciones</span>
                </a>
                <a 
                  href="https://www.facebook.com/kodeon.soluciones" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Facebook de KodeON"
                >
                  <Facebook className={styles.socialIcon} />
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://www.linkedin.com/company/kodeon-health" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="LinkedIn de KodeON"
                >
                  <Linkedin className={styles.socialIcon} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            
            <div className={styles.hoursCard}>
              <h4 className={styles.hoursTitle}>Cómo podemos ayudarte</h4>
              <div className={styles.hoursList}>
                <div>Implementación de software para gestión médica</div>
                <div>Mantenimiento preventivo y correctivo</div>
                <div>Soporte técnico y seguimiento operativo</div>
              </div>
            </div>
          </div>
          
          <div className={styles.demoCard}>
            <h3>Solicitar demo o servicio técnico</h3>
            <p className={styles.demoDescription}>
              Contanos si necesitás una demo del sistema o asistencia técnica sobre equipamiento.
              Armamos una propuesta según tu prioridad actual.
            </p>
            
            <div className={styles.demoButtons}>
              <a 
                href="https://wa.me/5492944369647?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20demo%20de%20KodeON" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.demoPrimaryButton}
              >
                <Phone className="w-5 h-5" />
                <span>Agendar por WhatsApp</span>
              </a>
              
              <a 
                href="mailto:on.kode.soluciones@gmail.com?subject=Solicitud%20de%20Demo%20KodeON" 
                className={styles.demoSecondaryButton}
              >
                <Mail className="w-5 h-5" />
                <span>Enviar email</span>
              </a>
            </div>
            
            <div className={styles.demoGuarantee}>
              <p className={styles.demoGuaranteeText}>
                <strong>Respuesta garantizada en 24 horas</strong><br/>
                Nuestro equipo técnico especializado te contactará para coordinar la mejor fecha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
