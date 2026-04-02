import { useEffect, useState } from 'react';
import Logo from './components/Logo';
import { supabase, getMyProfile, getDashboardPathByRole } from './lib/supabase.js';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const profile = await getMyProfile();
          if (profile?.role) {
            window.location.href = getDashboardPathByRole(profile.role);
            return;
          }
        }
      } catch {
        // Keep login visible if Supabase unavailable
      } finally {
        setLoadingSession(false);
      }
    }

    checkSession();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Ingresando...');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setStatus(error.message === 'Invalid login credentials'
          ? 'Credenciales inválidas.'
          : error.message);
        return;
      }

      const profile = await getMyProfile();
      if (!profile?.role) {
        setStatus('No se encontró el perfil. Contacta al administrador.');
        return;
      }

      if (!profile.active) {
        await supabase.auth.signOut();
        setStatus('Cuenta desactivada.');
        return;
      }

      window.location.href = getDashboardPathByRole(profile.role);
    } catch {
      setStatus('No se pudo conectar con el servidor.');
    }
  }

  if (loadingSession) {
    return (
      <main className={styles.loading}>
        <p>Verificando sesión...</p>
      </main>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topStrip} aria-hidden />
      <div className={styles.inner}>
        <section className={styles.card}>
          <div className={styles.logoWrap}>
            <Logo />
          </div>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.subtitle}>Acceso para dueño y clientes de KodeON.</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              autoComplete="current-password"
            />
            <button type="submit" className={styles.submit}>
              Entrar
            </button>
          </form>
          {status && <p className={styles.status}>{status}</p>}
          <a href="/" className={styles.back}>
            Volver a la landing
          </a>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
