import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <section id="contacto" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h2 className={styles.contactTitle}>¿Listo para desarrollar tu software médico?</h2>
          <p className={styles.contactSubtitle}>
            Contacta con nuestro equipo de desarrollo especializado. Desde consultorios hasta hospitales, 
            creamos la solución perfecta para tu práctica médica.
          </p>
        </div>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactInfoSection}>
            <h3>Información de Contacto</h3>
            
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.contactIconBlue}`}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={styles.contactLabel}>WhatsApp Business</div>
                  <div className={styles.contactValue}>+54 9 2944 36-9647</div>
                </div>
              </div>
              
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.contactIconGreen}`}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={styles.contactLabel}>Email</div>
                  <div className={styles.contactValue}>on.code.soluciones@gmail.com</div>
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
              <h4 className={styles.socialTitle}>Síguenos en Redes Sociales</h4>
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
                  href="https://linkedin.com/company/kodeon-health" 
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
              <h4 className={styles.hoursTitle}>Atención Personalizada</h4>
              <div className={styles.hoursList}>
                <div>Horarios flexibles según tu disponibilidad</div>
                <div>Reuniones adaptadas a tu agenda</div>
                <div>Soporte técnico cuando lo necesites</div>
              </div>
            </div>
          </div>
          
          <div className={styles.demoCard}>
            <h3>Solicitar Demo</h3>
            <p className={styles.demoDescription}>
              Agenda una demostración personalizada y descubre todas las funcionalidades 
              de KodeON adaptadas a las necesidades de tu hospital.
            </p>
            
            <div className={styles.demoButtons}>
              <a 
                href="https://wa.me/5492944369647?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20demo%20de%20KodeON" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.demoPrimaryButton}
              >
                <Phone className="w-5 h-5" />
                <span>Agendar Demo por WhatsApp</span>
              </a>
              
              <a 
                href="mailto:on.code.soluciones@gmail.com?subject=Solicitud%20de%20Demo%20KodeON" 
                className={styles.demoSecondaryButton}
              >
                <Mail className="w-5 h-5" />
                <span>Enviar Email</span>
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
