import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <h3 className={styles.brand}>KodeON</h3>
            <p className={styles.description}>
              Soluciones en salud: venta de equipos, servicio técnico, asesoramiento
              y desarrollo de software.
            </p>
            <div className={styles.social}>
              <a href="https://www.instagram.com/kode.on.soluciones/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="https://www.facebook.com/kodeon.soluciones" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="https://www.linkedin.com/in/enzo-gonzalo-beltr%C3%A1n-a04b39207/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </div>
          </div>

          <div>
            <h4>Navegación</h4>
            <ul>
              <li><Link to="/equipos">Equipos</Link></li>
              <li><Link to="/servicios">Servicio técnico</Link></li>
              <li><Link to="/software">Software</Link></li>
              <li><Link to="/clientes">Clientes</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4>Servicios</h4>
            <ul>
              <li>Venta de equipamiento</li>
              <li>Mantenimiento biomédico</li>
              <li>Asesoramiento técnico</li>
              <li>Desarrollo a medida</li>
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href="https://wa.me/5492944369647" target="_blank" rel="noopener noreferrer">
                  +54 9 2944 36-9647
                </a>
              </li>
              <li>
                <a href="mailto:on.kode.soluciones@gmail.com">on.kode.soluciones@gmail.com</a>
              </li>
              <li>Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {currentYear} KodeON. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
