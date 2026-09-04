import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  Menu,
  X,
} from 'lucide-react';
import Logo from './Logo';
import Footer from './Footer';
import BackToTop from './BackToTop';
import styles from './SiteLayout.module.css';

const navItems = [
  { to: '/equipos', label: 'Equipos' },
  { to: '/servicios', label: 'Servicio técnico' },
  { to: '/software', label: 'Software' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/contacto', label: 'Contacto' },
];

function SiteLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className={styles.appContainer}>
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.topBarLeft}>
            <div className={styles.topBarItem}>
              <Phone className={styles.topBarIcon} />
              <span>+54 9 2944 36-9647</span>
            </div>
            <div className={styles.topBarItem}>
              <Mail className={styles.topBarIcon} />
              <span>on.kode.soluciones@gmail.com</span>
            </div>
          </div>
          <div className={styles.topBarRight}>
            <a href="https://www.instagram.com/kode.on.soluciones/" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Instagram">
              <Instagram className={styles.socialIcon} />
            </a>
            <a href="https://www.facebook.com/kodeon.soluciones" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Facebook">
              <Facebook className={styles.socialIcon} />
            </a>
            <a href="https://www.linkedin.com/in/enzo-gonzalo-beltr%C3%A1n-a04b39207/" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="LinkedIn">
              <Linkedin className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <Link to="/" className={styles.logoLink} aria-label="KodeON inicio">
              <Logo />
            </Link>

            <nav className={styles.headerNav} aria-label="Principal">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/login" className={styles.loginButton}>Iniciar sesión</Link>
            </nav>

            <button
              type="button"
              className={styles.menuButton}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Móvil">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.mobileNavLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/login" className={styles.mobileLogin}>Iniciar sesión</Link>
          </nav>
        )}
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />

      <a
        href="https://wa.me/5492944369647?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20KodeON"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappFloating}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className={styles.whatsappIcon} />
        <span className={styles.whatsappText}>WhatsApp</span>
      </a>

      <BackToTop />
    </div>
  );
}

export default SiteLayout;
