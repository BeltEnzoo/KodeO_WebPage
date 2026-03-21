import { useEffect, useState } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { getProfile, signOut, getMyJobs } from '../../lib/supabaseApi.js';
import styles from './ClientDashboard.module.css';

function ClientDashboard() {
  const [status, setStatus] = useState('Cargando panel...');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');

  useEffect(() => {
    async function loadMe() {
      const profile = await getProfile();
      if (!profile || profile.role !== 'CLIENT') {
        window.location.href = '/login';
        return;
      }
      setUser(profile);
      setStatus('Panel listo.');
      await loadMyJobs();
    }
    loadMe();
  }, []);

  async function loadMyJobs() {
    setJobsLoading(true);
    try {
      const list = await getMyJobs();
      setJobs(list);
    } catch (e) {
      setJobsError(e.message ?? 'No se pudo cargar tus trabajos.');
    }
    setJobsLoading(false);
  }

  async function handleLogout() {
    await signOut();
    window.location.href = '/';
  }

  return (
    <main className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Panel Cliente</h2>
        <p className={styles.sidebarSubtitle}>{status}</p>
        {user && (
          <p className={styles.sidebarSubtitle}>
            Sesion: <strong>{user.name}</strong>
          </p>
        )}
        <div className={styles.menuButton}>
          <BriefcaseBusiness className={styles.menuIcon} />
          Mis trabajos
        </div>
        <div className={styles.actions}>
          <a href="/" className={styles.link}>
            Volver
          </a>
          <button type="button" onClick={handleLogout} className={styles.danger}>
            Salir
          </button>
        </div>
      </aside>

      <section className={styles.main}>
        <article className={styles.card}>
          <h3 className={styles.title}>Mi actividad</h3>
          {jobsLoading ? (
            <p className={styles.muted}>Cargando tus trabajos...</p>
          ) : jobsError ? (
            <p style={{ color: '#ef4444' }}>{jobsError}</p>
          ) : jobs.length === 0 ? (
            <p className={styles.muted}>Aun no hay trabajos asignados para tu cliente.</p>
          ) : (
            <div className={styles.jobsList}>
              {jobs.map((job) => (
                <article key={job.id} className={styles.jobItem}>
                  <h3 className={styles.title}>{job.title}</h3>
                  {job.description && <p className={styles.muted}>{job.description}</p>}
                  <p className={styles.muted}>
                    Estado trabajo: <strong>{job.workStatus}</strong>
                  </p>
                  <p className={styles.muted}>
                    Estado facturacion: <strong>{job.billingStatus}</strong>
                  </p>
                  <p className={styles.muted}>
                    Monto: {job.amount != null ? `$${Number(job.amount).toFixed(2)}` : '-'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default ClientDashboard;
