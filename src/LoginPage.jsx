import { useEffect, useState } from 'react';
import { apiRequest, getDashboardPathByRole } from './app/services/api.js';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const { response, payload } = await apiRequest('/api/auth/me', { method: 'GET' });
        if (response.ok && payload?.user?.role) {
          window.location.href = getDashboardPathByRole(payload.user.role);
          return;
        }
      } catch {
        // Keep login visible if API is unavailable.
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
      const { response, payload } = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setStatus(payload?.error ?? 'No se pudo iniciar sesion.');
        return;
      }

      window.location.href = getDashboardPathByRole(payload.user.role);
    } catch {
      setStatus('No se pudo conectar con la API.');
    }
  }

  if (loadingSession) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1rem' }}>
        <p>Verificando sesion...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1rem' }}>
      <section style={{ width: '100%', maxWidth: 420, border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Iniciar sesion</h1>
        <p style={{ color: '#4b5563' }}>Acceso para dueño y clientes de KodeON.</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
          />
          <input
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
          />
          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Entrar
          </button>
        </form>
        {status && <p style={{ marginTop: 12 }}>{status}</p>}
        <a href="/" style={{ display: 'inline-block', marginTop: 12, color: '#2563eb' }}>
          Volver a la landing
        </a>
      </section>
    </main>
  );
}

export default LoginPage;
