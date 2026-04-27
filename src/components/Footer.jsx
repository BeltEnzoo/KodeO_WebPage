import React from 'react';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSectionBrand}>
            <h3 className={styles.footerBrandTitle}>KodeON</h3>
            <p className={styles.footerDescription}>
              Software y servicio tecnico para equipamiento medico.
              Implementacion, mantenimiento y soporte en campo.
            </p>
            <div className={styles.socialLinks}>
              <a 
                href="https://www.instagram.com/kode.on.soluciones/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram de KodeON"
              >
                <Instagram className={styles.socialIcon} />
              </a>
              <a 
                href="https://www.facebook.com/kodeon.soluciones" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook de KodeON"
              >
                <Facebook className={styles.socialIcon} />
              </a>
              <a 
                href="https://www.linkedin.com/company/kodeon-health" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn de KodeON"
              >
                <Linkedin className={styles.socialIcon} />
              </a>
            </div>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Navegacion</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#servicios">Servicios tecnicos</a></li>
              <li><a href="#productos">Soluciones digitales</a></li>
              <li><a href="#beneficios">Beneficios</a></li>
              <li><a href="#clientes">Clientes</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Soluciones</h4>
            <ul className={styles.footerLinks}>
              <li>Mantenimiento preventivo</li>
              <li>Mantenimiento correctivo</li>
              <li>Gestion de equipamiento</li>
              <li>Desarrollo a medida</li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Contacto</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="https://wa.me/5492944369647?text=Hola%2C%20quiero%20consultar%20por%20los%20servicios%20de%20KodeON" target="_blank" rel="noopener noreferrer">
                  +54 9 2944 36-9647
                </a>
              </li>
              <li>
                <a href="mailto:on.kode.soluciones@gmail.com">
                  on.kode.soluciones@gmail.com
                </a>
              </li>
              <li>Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} KodeON. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
