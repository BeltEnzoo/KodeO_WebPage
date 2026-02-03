import React from 'react';
import Logo from './Logo';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrand}>
              <Logo />
            </div>
            <p className={styles.footerDescription}>
              Agencia especializada en desarrollo de software médico. 
              Soluciones a medida para todo el sector salud argentino.
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
          
          <div>
            <h4>Productos</h4>
            <ul className={styles.footerLinks}>
              <li>Consultorios</li>
              <li>Clínicas</li>
              <li>Hospitales</li>
              <li>Equipos médicos</li>
              <li>Farmacias</li>
            </ul>
          </div>
          
          <div>
            <h4>Empresa</h4>
            <ul className={styles.footerLinks}>
              <li>Nosotros</li>
              <li>Carreras</li>
              <li>Prensa</li>
              <li>Blog</li>
            </ul>
          </div>
          
          <div>
            <h4>Contacto</h4>
            <ul className={styles.footerLinks}>
              <li>+54 9 2944 36-9647</li>
              <li>on.kode.soluciones@gmail.com</li>
              <li>Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2024 KodeON. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
