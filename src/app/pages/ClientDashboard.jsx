import { useEffect, useState } from 'react';
import { BriefcaseBusiness, FileText } from 'lucide-react';
import { getProfile, signOut, getMyJobs, getMyEquipmentInterventions } from '../../lib/supabaseApi.js';
import { downloadRemitoPdf } from '../../lib/generateRemitoPdf.js';
import styles from './ClientDashboard.module.css';

const workStatusLabel = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  DONE: 'Finalizado',
};

const billingStatusLabel = {
  NOT_INVOICED: 'No facturado',
  INVOICED: 'Facturado',
  PAID: 'Pagado',
};

function remitoReady(item) {
  return Boolean(String(item.diagnosis ?? '').trim() && String(item.technicalAction ?? '').trim());
}

function ClientDashboard() {
  const [status, setStatus] = useState('Cargando panel...');
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [remitos, setRemitos] = useState([]);
  const [remitosLoading, setRemitosLoading] = useState(true);
  const [remitosError, setRemitosError] = useState('');
  const [remitoStatus, setRemitoStatus] = useState('');

  useEffect(() => {
    async function loadMe() {
      const profile = await getProfile();
      if (!profile || profile.role !== 'CLIENT') {
        window.location.href = '/login';
        return;
      }
      setUser(profile);
      setStatus('Panel listo.');
      await Promise.all([loadMyJobs(), loadMyRemitos()]);
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

  async function loadMyRemitos() {
    setRemitosLoading(true);
    try {
      const list = await getMyEquipmentInterventions();
      setRemitos(list);
      setRemitosError('');
    } catch (e) {
      setRemitosError(e.message ?? 'No se pudieron cargar tus remitos.');
    }
    setRemitosLoading(false);
  }

  async function handleDownloadRemito(equipment) {
    setRemitoStatus('Generando remito...');
    try {
      await downloadRemitoPdf(equipment);
      setRemitoStatus('Remito descargado.');
    } catch (e) {
      setRemitoStatus(e.message ?? 'No se pudo generar el remito.');
    }
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
        <div className={styles.menu}>
          <button
            type="button"
            className={`${styles.menuButton} ${activeSection === 'jobs' ? styles.menuButtonActive : ''}`}
            onClick={() => setActiveSection('jobs')}
          >
            <BriefcaseBusiness className={styles.menuIcon} />
            Mis trabajos
          </button>
          <button
            type="button"
            className={`${styles.menuButton} ${activeSection === 'remitos' ? styles.menuButtonActive : ''}`}
            onClick={() => setActiveSection('remitos')}
          >
            <FileText className={styles.menuIcon} />
            Mis remitos
          </button>
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
        {activeSection === 'jobs' && (
          <article className={styles.card}>
            <h3 className={styles.title}>Mi actividad</h3>
            {jobsLoading ? (
              <p className={styles.muted}>Cargando tus trabajos...</p>
            ) : jobsError ? (
              <p className={styles.error}>{jobsError}</p>
            ) : jobs.length === 0 ? (
              <p className={styles.muted}>Aun no hay trabajos asignados para tu cliente.</p>
            ) : (
              <div className={styles.jobsList}>
                {jobs.map((job) => (
                  <article key={job.id} className={styles.jobItem}>
                    <h3 className={styles.title}>{job.title}</h3>
                    {job.description && <p className={styles.muted}>{job.description}</p>}
                    <p className={styles.muted}>
                      Estado trabajo: <strong>{workStatusLabel[job.workStatus] ?? job.workStatus}</strong>
                    </p>
                    <p className={styles.muted}>
                      Estado facturacion: <strong>{billingStatusLabel[job.billingStatus] ?? job.billingStatus}</strong>
                    </p>
                    <p className={styles.muted}>
                      Monto: {job.amount != null ? `$${Number(job.amount).toFixed(2)}` : '-'}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </article>
        )}

        {activeSection === 'remitos' && (
          <article className={styles.card}>
            <h3 className={styles.title}>Mis remitos</h3>
            <p className={styles.muted}>
              Intervenciones técnicas de tu institución. El PDF se puede descargar cuando el registro tiene diagnóstico y acción técnica.
            </p>
            {remitosLoading ? (
              <p className={styles.muted}>Cargando remitos...</p>
            ) : (
              <>
                {remitosError && <p className={styles.error}>{remitosError}</p>}
                {remitoStatus && <p className={styles.muted}>{remitoStatus}</p>}
                {!remitosError && remitos.length === 0 ? (
                  <p className={styles.muted}>Aún no hay remitos disponibles.</p>
                ) : (
                  <div className={styles.jobsList}>
                    {remitos.map((item) => (
                      <article key={item.id} className={styles.jobItem}>
                        <h3 className={styles.title}>{item.equipmentName}</h3>
                        <p className={styles.muted}>
                          Fecha: <strong>{item.intakeDate ? new Date(item.intakeDate).toLocaleDateString('es-AR') : '-'}</strong>
                          {' · '}
                          {item.location === 'CAMPO' ? 'Campo' : 'Taller'}
                        </p>
                        <p className={styles.muted}>
                          {[item.brand, item.model].filter(Boolean).join(' · ') || 'Sin marca/modelo'}
                          {item.serialNumber ? ` · Serie ${item.serialNumber}` : ''}
                        </p>
                        {item.technicalAction && (
                          <p className={styles.muted}>{item.technicalAction}</p>
                        )}
                        {remitoReady(item) ? (
                          <button
                            type="button"
                            className={styles.buttonPrimary}
                            onClick={() => handleDownloadRemito(item)}
                          >
                            Descargar remito
                          </button>
                        ) : (
                          <p className={styles.muted}>
                            Pendiente: falta diagnóstico o acción técnica para generar el remito.
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </article>
        )}
      </section>
    </main>
  );
}

export default ClientDashboard;
