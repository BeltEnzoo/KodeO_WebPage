import { useEffect, useState } from 'react';
import { BriefcaseBusiness, FileText, Menu, TrendingUp, UserPlus, Users } from 'lucide-react';
import {
  getProfile,
  signOut,
  getClients,
  createClient as apiCreateClient,
  updateClient as apiUpdateClient,
  deleteClient as apiDeleteClient,
  getJobs,
  createJob as apiCreateJob,
  updateJob as apiUpdateJob,
  deleteJob as apiDeleteJob,
  getClientUsers,
  createClientUser as apiCreateClientUser,
  updateClientUser as apiUpdateClientUser,
  deleteClientUser as apiDeleteClientUser,
  getQuotes,
  createQuote as apiCreateQuote,
  generateQuotePdf as apiGenerateQuotePdf,
  deleteQuote as apiDeleteQuote,
  getQuotePdfSignedUrl,
  getCashMovements,
  createCashMovement,
  deleteCashMovement,
  getBalanceSummary,
} from '../../lib/supabaseApi.js';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('clients');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState('Cargando panel...');
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [form, setForm] = useState({
    businessName: '',
    cuit: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [formStatus, setFormStatus] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobForm, setJobForm] = useState({
    clientId: '',
    title: '',
    description: '',
    amount: '',
    expenseShipping: '',
    expenseRepuestos: '',
    expenseTerciarizacion: '',
    workStatus: 'PENDING',
    billingStatus: 'NOT_INVOICED',
  });
  const [jobFormStatus, setJobFormStatus] = useState('');
  const [clientUsers, setClientUsers] = useState([]);
  const [clientUsersLoading, setClientUsersLoading] = useState(true);
  const [clientUserForm, setClientUserForm] = useState({
    name: '',
    email: '',
    password: '',
    clientId: '',
  });
  const [clientUserStatus, setClientUserStatus] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quoteForm, setQuoteForm] = useState({
    clientId: '',
    validUntil: '',
    taxPercent: '0',
    notes: '',
  });
  const [quoteItems, setQuoteItems] = useState([
    { description: '', qty: '1', unitPrice: '', imageData: '' },
  ]);
  const [quoteStatus, setQuoteStatus] = useState('');
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [cashMovements, setCashMovements] = useState([]);
  const [cashMovementsLoading, setCashMovementsLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'PUBLICIDAD',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [expenseStatus, setExpenseStatus] = useState('');
  const [editingJobId, setEditingJobId] = useState(null);
  const [editJobForm, setEditJobForm] = useState({});
  const [editingClientId, setEditingClientId] = useState(null);
  const [editingClientUserId, setEditingClientUserId] = useState(null);
  const [editClientUserForm, setEditClientUserForm] = useState({});

  useEffect(() => {
    async function loadMe() {
      const profile = await getProfile();
      if (!profile || profile.role !== 'ADMIN') {
        window.location.href = '/login';
        return;
      }
      setUser(profile);
      setStatus('Panel listo.');
      await loadClients();
      await loadJobs();
      await loadClientUsers();
      await loadQuotes();
    }
    loadMe();
  }, []);

  useEffect(() => {
    if (activeSection === 'balance') {
      loadBalance();
      loadCashMovements();
    }
  }, [activeSection]);

  async function loadClients() {
    setClientsLoading(true);
    try {
      const list = await getClients();
      setClients(list);
    } catch (e) {
      setFormStatus(e.message ?? 'No se pudo cargar clientes.');
    }
    setClientsLoading(false);
  }

  async function loadJobs() {
    setJobsLoading(true);
    try {
      const list = await getJobs();
      setJobs(list);
    } catch (e) {
      setJobFormStatus(e.message ?? 'No se pudo cargar trabajos.');
    }
    setJobsLoading(false);
  }

  async function loadClientUsers() {
    setClientUsersLoading(true);
    try {
      const list = await getClientUsers();
      setClientUsers(list);
    } catch (e) {
      setClientUserStatus(e.message ?? 'No se pudo cargar usuarios cliente.');
    }
    setClientUsersLoading(false);
  }

  async function loadQuotes() {
    setQuotesLoading(true);
    try {
      const list = await getQuotes();
      setQuotes(list);
    } catch (e) {
      setQuoteStatus(e.message ?? 'No se pudo cargar presupuestos.');
    }
    setQuotesLoading(false);
  }

  async function loadBalance() {
    setBalanceLoading(true);
    try {
      const data = await getBalanceSummary();
      setBalance(data);
    } catch (e) {
      setBalance(null);
    }
    setBalanceLoading(false);
  }

  async function loadCashMovements() {
    setCashMovementsLoading(true);
    try {
      const list = await getCashMovements({ type: 'EXPENSE' });
      setCashMovements(list);
    } catch (e) {
      setExpenseStatus(e.message ?? 'No se pudieron cargar gastos.');
    }
    setCashMovementsLoading(false);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleJobInputChange(event) {
    const { name, value } = event.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleClientUserInputChange(event) {
    const { name, value } = event.target;
    setClientUserForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleQuoteInputChange(event) {
    const { name, value } = event.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleQuoteItemChange(index, field, value) {
    setQuoteItems((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function addQuoteItem() {
    setQuoteItems((prev) => [...prev, { description: '', qty: '1', unitPrice: '', imageData: '' }]);
  }

  function removeQuoteItem(index) {
    setQuoteItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleQuoteItemImageChange(index, file) {
    if (!file) {
      handleQuoteItemChange(index, 'imageData', '');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleQuoteItemChange(index, 'imageData', String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  }

  function startEditClient(client) {
    setEditingClientId(client.id);
    setForm({
      businessName: client.businessName ?? '',
      cuit: client.cuit ?? '',
      phone: client.phone ?? '',
      email: client.email ?? '',
      address: client.address ?? '',
      notes: client.notes ?? '',
    });
  }

  function cancelEditClient() {
    setEditingClientId(null);
    setForm({ businessName: '', cuit: '', phone: '', email: '', address: '', notes: '' });
  }

  async function handleCreateClient(event) {
    event.preventDefault();
    setFormStatus('Guardando cliente...');
    try {
      if (editingClientId) {
        await apiUpdateClient(editingClientId, form);
        setFormStatus('Cliente actualizado correctamente.');
        cancelEditClient();
      } else {
        await apiCreateClient(form);
        setForm({ businessName: '', cuit: '', phone: '', email: '', address: '', notes: '' });
        setFormStatus('Cliente creado correctamente.');
      }
      await loadClients();
    } catch (e) {
      setFormStatus(e.message ?? 'No se pudo guardar el cliente.');
    }
  }

  async function handleDeleteClient(clientId) {
    if (!window.confirm('¿Eliminar este cliente? Se eliminarán también sus trabajos y presupuestos asociados.')) return;
    try {
      await apiDeleteClient(clientId);
      setFormStatus('Cliente eliminado.');
      if (editingClientId === clientId) cancelEditClient();
      await loadClients();
      await loadJobs();
      await loadQuotes();
      await loadClientUsers();
    } catch (e) {
      setFormStatus(e.message ?? 'No se pudo eliminar.');
    }
  }

  async function handleLogout() {
    await signOut();
    window.location.href = '/';
  }

  async function handleCreateJob(event) {
    event.preventDefault();
    setJobFormStatus('Guardando trabajo...');
    try {
      await apiCreateJob(jobForm);
      setJobForm({
        clientId: '',
        title: '',
        description: '',
        amount: '',
        expenseShipping: '',
        expenseRepuestos: '',
        expenseTerciarizacion: '',
        workStatus: 'PENDING',
        billingStatus: 'NOT_INVOICED',
      });
      setJobFormStatus('Trabajo creado correctamente.');
      await loadJobs();
      await loadClients();
    } catch (e) {
      setJobFormStatus(e.message ?? 'No se pudo crear el trabajo.');
    }
  }

  function handleExpenseInputChange(event) {
    const { name, value } = event.target;
    setExpenseForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddExpense(event) {
    event.preventDefault();
    setExpenseStatus('Guardando gasto...');
    try {
      await createCashMovement({
        type: 'EXPENSE',
        category: expenseForm.category,
        description: expenseForm.description,
        amount: expenseForm.amount,
        date: expenseForm.date,
      });
      setExpenseForm({ category: 'PUBLICIDAD', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });
      setExpenseStatus('Gasto registrado.');
      await loadBalance();
      await loadCashMovements();
    } catch (e) {
      setExpenseStatus(e.message ?? 'No se pudo registrar el gasto.');
    }
  }

  async function handleDeleteExpense(id) {
    if (!window.confirm('¿Eliminar este gasto?')) return;
    try {
      await deleteCashMovement(id);
      setExpenseStatus('Gasto eliminado.');
      await loadBalance();
      await loadCashMovements();
    } catch (e) {
      setExpenseStatus(e.message ?? 'No se pudo eliminar.');
    }
  }

  function startEditJob(job) {
    setEditingJobId(job.id);
    setEditJobForm({
      clientId: job.client?.id ?? '',
      title: job.title ?? '',
      description: job.description ?? '',
      amount: job.amount ?? '',
      expenseShipping: job.expenseShipping ?? '',
      expenseRepuestos: job.expenseRepuestos ?? '',
      expenseTerciarizacion: job.expenseTerciarizacion ?? '',
      workStatus: job.workStatus ?? 'PENDING',
      billingStatus: job.billingStatus ?? 'NOT_INVOICED',
    });
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm('¿Eliminar este trabajo?')) return;
    try {
      await apiDeleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setJobFormStatus('Trabajo eliminado.');
      if (editingJobId === jobId) setEditingJobId(null);
      await loadClients();
      if (activeSection === 'balance') await loadBalance();
    } catch (e) {
      setJobFormStatus(e.message ?? 'No se pudo eliminar.');
    }
  }

  function handleEditJobChange(e) {
    const { name, value } = e.target;
    setEditJobForm((prev) => ({ ...prev, [name]: value }));
  }

  async function saveEditJob(jobId) {
    try {
      const updates = { ...editJobForm };
      const updated = await apiUpdateJob(jobId, updates);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...updated } : j)));
      setEditingJobId(null);
      setEditJobForm({});
      setJobFormStatus('Trabajo actualizado.');
      await loadClients();
      if (activeSection === 'balance') await loadBalance();
    } catch (e) {
      setJobFormStatus(e.message ?? 'No se pudo actualizar.');
    }
  }

  async function handleUpdateJobStatus(jobId, updates) {
    try {
      const updated = await apiUpdateJob(jobId, updates);
      setJobs((prev) => prev.map((job) => (job.id === jobId ? updated : job)));
      await loadClients();
      if (activeSection === 'balance') await loadBalance();
    } catch (e) {
      setJobFormStatus(e.message ?? 'No se pudo actualizar estado.');
    }
  }

  function startEditClientUser(u) {
    setEditingClientUserId(u.id);
    setEditClientUserForm({
      name: u.name ?? '',
      active: u.active ?? true,
      clientId: u.client?.id ?? '',
    });
  }

  function cancelEditClientUser() {
    setEditingClientUserId(null);
    setEditClientUserForm({});
  }

  async function handleCreateClientUser(event) {
    event.preventDefault();
    setClientUserStatus('Guardando usuario...');
    try {
      if (editingClientUserId) {
        await apiUpdateClientUser(editingClientUserId, editClientUserForm);
        setClientUserStatus('Usuario actualizado correctamente.');
        cancelEditClientUser();
      } else {
        await apiCreateClientUser(clientUserForm);
        setClientUserForm({ name: '', email: '', password: '', clientId: '' });
        setClientUserStatus('Usuario cliente creado correctamente.');
      }
      await loadClientUsers();
      await loadClients();
    } catch (e) {
      setClientUserStatus(e.message ?? 'No se pudo guardar el usuario cliente.');
    }
  }

  async function handleDeleteClientUser(userId) {
    if (!window.confirm('¿Eliminar este usuario cliente? No podrá volver a iniciar sesión.')) return;
    try {
      await apiDeleteClientUser(userId);
      setClientUserStatus('Usuario eliminado.');
      if (editingClientUserId === userId) cancelEditClientUser();
      await loadClientUsers();
      await loadClients();
    } catch (e) {
      setClientUserStatus(e.message ?? 'No se pudo eliminar.');
    }
  }

  async function handleCreateQuote(event) {
    event.preventDefault();
    setQuoteStatus('Creando presupuesto...');
    try {
      const payload = {
        clientId: quoteForm.clientId,
        validUntil: quoteForm.validUntil || undefined,
        taxPercent: Number(quoteForm.taxPercent || 0),
        notes: quoteForm.notes || undefined,
        items: quoteItems.map((item) => ({
          description: item.description,
          qty: Number(item.qty || 1),
          unitPrice: Number(item.unitPrice || 0),
          imageData: item.imageData || undefined,
        })),
      };
      const quote = await apiCreateQuote(payload);
      setQuoteForm({ clientId: '', validUntil: '', taxPercent: '0', notes: '' });
      setQuoteItems([{ description: '', qty: '1', unitPrice: '', imageData: '' }]);
      setQuoteStatus(`Presupuesto #${quote?.number ?? '?'} creado.`);
      await loadQuotes();
    } catch (e) {
      setQuoteStatus(e.message ?? 'No se pudo crear el presupuesto.');
    }
  }

  async function handleGenerateQuotePdf(quoteId) {
    setQuoteStatus('Generando PDF...');
    try {
      const data = await apiGenerateQuotePdf(quoteId);
      setQuoteStatus('PDF generado correctamente.');
      await loadQuotes();
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (e) {
      setQuoteStatus(e.message ?? 'No se pudo generar el PDF.');
    }
  }

  async function handleDeleteQuote(quoteId) {
    const confirmed = window.confirm('Se eliminará el presupuesto y su PDF generado. ¿Continuar?');
    if (!confirmed) return;
    try {
      await apiDeleteQuote(quoteId);
      setQuoteStatus('Presupuesto eliminado correctamente.');
      await loadQuotes();
    } catch (e) {
      setQuoteStatus(e.message ?? 'No se pudo eliminar el presupuesto.');
    }
  }

  const sections = [
    { id: 'clients', label: '1) Crear cliente', icon: Users },
    { id: 'jobs', label: '2) Crear trabajo', icon: BriefcaseBusiness },
    { id: 'clientUsers', label: '3) Crear usuario cliente', icon: UserPlus },
    { id: 'quotes', label: '4) Crear presupuesto', icon: FileText },
    { id: 'balance', label: '5) Balance', icon: TrendingUp },
  ];

  return (
    <main className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>KODEON</h2>
        <p className={styles.sidebarSubtitle}>{status}</p>
        {user && (
          <p className={styles.sidebarSubtitle}>
            Sesion: <strong>{user.role === 'ADMIN' ? 'Enzo G Beltran' : user.name}</strong>
          </p>
        )}
        <button type="button" className={styles.mobileToggle} onClick={() => setMobileMenuOpen((prev) => !prev)}>
          <Menu className={styles.menuIcon} />
          {mobileMenuOpen ? 'Ocultar menu' : 'Mostrar menu'}
        </button>
        <div className={`${styles.menu} ${mobileMenuOpen ? '' : styles.mobileMenuHidden}`}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                setActiveSection(section.id);
                setMobileMenuOpen(false);
              }}
              className={`${styles.menuButton} ${activeSection === section.id ? styles.menuButtonActive : ''}`}
            >
              <section.icon className={styles.menuIcon} />
              {section.label}
            </button>
          ))}
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
        {activeSection === 'clients' && (
          <>
            <article className={styles.card}>
              <h3 className={styles.title}>{editingClientId ? 'Editar cliente' : 'Crear cliente'}</h3>
              <form onSubmit={handleCreateClient} className={styles.form}>
                <input name="businessName" placeholder="Razon social *" value={form.businessName} onChange={handleInputChange} required />
                <input name="cuit" placeholder="CUIT" value={form.cuit} onChange={handleInputChange} />
                <input name="phone" placeholder="Telefono" value={form.phone} onChange={handleInputChange} />
                <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleInputChange} />
                <input name="address" placeholder="Direccion" value={form.address} onChange={handleInputChange} />
                <textarea name="notes" placeholder="Notas" value={form.notes} onChange={handleInputChange} rows={3} />
                <div className={styles.actions}>
                  <button type="submit" className={styles.buttonPrimary}>
                    {editingClientId ? 'Guardar cambios' : 'Crear cliente'}
                  </button>
                  {editingClientId && (
                    <button type="button" onClick={cancelEditClient} className={styles.danger}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
              {formStatus && <p className={styles.muted}>{formStatus}</p>}
            </article>

            <article className={styles.card}>
              <h3 className={styles.title}>Clientes</h3>
              {clientsLoading ? (
                <p className={styles.muted}>Cargando clientes...</p>
              ) : clients.length === 0 ? (
                <p className={styles.muted}>Aun no hay clientes cargados.</p>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Razon social</th>
                        <th>CUIT</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th>Usuario cliente</th>
                        <th>Trabajos</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td>{client.businessName}</td>
                          <td>{client.cuit ?? '-'}</td>
                          <td>{client.email ?? '-'}</td>
                          <td>{client.phone ?? '-'}</td>
                          <td>{client.user?.email ?? '-'}</td>
                          <td>{client._count?.jobs ?? 0}</td>
                          <td className={styles.cellActions}>
                            <button type="button" onClick={() => startEditClient(client)} className={styles.linkButton}>Editar</button>
                            <button type="button" onClick={() => handleDeleteClient(client.id)} className={styles.danger} style={{ padding: '4px 8px', fontSize: '12px' }}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          </>
        )}

        {activeSection === 'jobs' && (
          <>
            <article className={styles.card}>
              <h3 className={styles.title}>Crear trabajo</h3>
              <form onSubmit={handleCreateJob} className={styles.form}>
                <select name="clientId" value={jobForm.clientId} onChange={handleJobInputChange} required>
                  <option value="">Seleccionar cliente *</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.businessName}
                    </option>
                  ))}
                </select>
                <input name="title" placeholder="Titulo del trabajo *" value={jobForm.title} onChange={handleJobInputChange} required />
                <textarea name="description" placeholder="Descripcion" value={jobForm.description} onChange={handleJobInputChange} rows={3} />
                <input name="amount" type="number" min="0" step="0.01" placeholder="Monto cobrado *" value={jobForm.amount} onChange={handleJobInputChange} />
                <div className={styles.row3}>
                  <input name="expenseShipping" type="number" min="0" step="0.01" placeholder="Gastos envio" value={jobForm.expenseShipping} onChange={handleJobInputChange} />
                  <input name="expenseRepuestos" type="number" min="0" step="0.01" placeholder="Gastos repuestos" value={jobForm.expenseRepuestos} onChange={handleJobInputChange} />
                  <input name="expenseTerciarizacion" type="number" min="0" step="0.01" placeholder="Gastos terciarizacion" value={jobForm.expenseTerciarizacion} onChange={handleJobInputChange} />
                </div>
                <div className={styles.row2}>
                  <select name="workStatus" value={jobForm.workStatus} onChange={handleJobInputChange}>
                    <option value="PENDING">Pendiente</option>
                    <option value="IN_PROGRESS">En progreso</option>
                    <option value="DONE">Finalizado</option>
                  </select>
                  <select name="billingStatus" value={jobForm.billingStatus} onChange={handleJobInputChange}>
                    <option value="NOT_INVOICED">No facturado</option>
                    <option value="INVOICED">Facturado</option>
                    <option value="PAID">Pagado</option>
                  </select>
                </div>
                <button type="submit" className={styles.buttonPrimary}>
                  Crear trabajo
                </button>
              </form>
              {jobFormStatus && <p className={styles.muted}>{jobFormStatus}</p>}
            </article>

            <article className={styles.card}>
              <h3 className={styles.title}>Trabajos</h3>
              {jobsLoading ? (
                <p className={styles.muted}>Cargando trabajos...</p>
              ) : jobs.length === 0 ? (
                <p className={styles.muted}>Aun no hay trabajos cargados.</p>
              ) : (
                <div className={styles.jobsList}>
                  {jobs.map((job) => (
                    <article key={job.id} className={styles.jobItem}>
                      <h4 className={styles.title}>{job.title}</h4>
                      <p className={styles.muted}>
                        Cliente: <strong>{job.client?.businessName}</strong>
                      </p>
                      <p className={styles.muted}>Monto cobrado: {job.amount != null ? `$${Number(job.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '-'}</p>
                      <p className={styles.muted}>
                        Gastos: Envios ${Number(job.expenseShipping ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })} | Repuestos ${Number(job.expenseRepuestos ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })} | Terciarizacion ${Number(job.expenseTerciarizacion ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </p>
                      {job.amount != null && (
                        <p className={styles.muted}>
                          Ganancia neta: <strong>${(Number(job.amount) - Number(job.expenseShipping ?? 0) - Number(job.expenseRepuestos ?? 0) - Number(job.expenseTerciarizacion ?? 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                        </p>
                      )}
                      {editingJobId === job.id ? (
                        <div className={styles.form} style={{ marginTop: '0.75rem' }}>
                          <select name="clientId" value={editJobForm.clientId} onChange={handleEditJobChange}>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>{c.businessName}</option>
                            ))}
                          </select>
                          <input name="title" placeholder="Titulo" value={editJobForm.title} onChange={handleEditJobChange} required />
                          <textarea name="description" placeholder="Descripcion" value={editJobForm.description} onChange={handleEditJobChange} rows={2} />
                          <div className={styles.row3}>
                            <input name="amount" placeholder="Monto" type="number" value={editJobForm.amount} onChange={handleEditJobChange} />
                            <input name="expenseShipping" placeholder="Gastos envio" type="number" value={editJobForm.expenseShipping} onChange={handleEditJobChange} />
                            <input name="expenseRepuestos" placeholder="Repuestos" type="number" value={editJobForm.expenseRepuestos} onChange={handleEditJobChange} />
                            <input name="expenseTerciarizacion" placeholder="Terciarizacion" type="number" value={editJobForm.expenseTerciarizacion} onChange={handleEditJobChange} />
                          </div>
                          <div className={styles.row2}>
                            <select name="workStatus" value={editJobForm.workStatus} onChange={handleEditJobChange}>
                              <option value="PENDING">Pendiente</option>
                              <option value="IN_PROGRESS">En progreso</option>
                              <option value="DONE">Finalizado</option>
                            </select>
                            <select name="billingStatus" value={editJobForm.billingStatus} onChange={handleEditJobChange}>
                              <option value="NOT_INVOICED">No facturado</option>
                              <option value="INVOICED">Facturado</option>
                              <option value="PAID">Pagado</option>
                            </select>
                          </div>
                          <div className={styles.actions}>
                            <button type="button" onClick={() => saveEditJob(job.id)} className={styles.buttonPrimary}>
                              Guardar
                            </button>
                            <button type="button" onClick={() => setEditingJobId(null)} className={styles.danger}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.actions} style={{ marginTop: '0.5rem' }}>
                          <button type="button" onClick={() => startEditJob(job)} className={styles.linkButton} style={{ fontSize: '0.8rem' }}>
                            Editar
                          </button>
                          <button type="button" onClick={() => handleDeleteJob(job.id)} className={styles.danger} style={{ padding: '4px 8px', fontSize: '12px' }}>
                            Eliminar
                          </button>
                        </div>
                      )}
                      <div className={styles.row2} style={{ marginTop: '0.5rem' }}>
                        <select value={job.workStatus} onChange={(event) => handleUpdateJobStatus(job.id, { workStatus: event.target.value })}>
                          <option value="PENDING">Pendiente</option>
                          <option value="IN_PROGRESS">En progreso</option>
                          <option value="DONE">Finalizado</option>
                        </select>
                        <select value={job.billingStatus} onChange={(event) => handleUpdateJobStatus(job.id, { billingStatus: event.target.value })}>
                          <option value="NOT_INVOICED">No facturado</option>
                          <option value="INVOICED">Facturado</option>
                          <option value="PAID">Pagado</option>
                        </select>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          </>
        )}

        {activeSection === 'clientUsers' && (
          <article className={styles.card}>
            <h3 className={styles.title}>{editingClientUserId ? 'Editar usuario cliente' : 'Crear usuario cliente'}</h3>
            <form onSubmit={handleCreateClientUser} className={styles.form}>
              <input name="name" placeholder="Nombre *" value={editingClientUserId ? editClientUserForm.name : clientUserForm.name} onChange={editingClientUserId ? (e) => setEditClientUserForm((p) => ({ ...p, name: e.target.value })) : handleClientUserInputChange} required />
              {!editingClientUserId && (
                <>
                  <input name="email" type="email" placeholder="Email de acceso *" value={clientUserForm.email} onChange={handleClientUserInputChange} required />
                  <input name="password" type="password" placeholder="Contrasena inicial *" value={clientUserForm.password} onChange={handleClientUserInputChange} required />
                </>
              )}
              <select
                name="clientId"
                value={editingClientUserId ? editClientUserForm.clientId : clientUserForm.clientId}
                onChange={editingClientUserId ? (e) => setEditClientUserForm((p) => ({ ...p, clientId: e.target.value })) : handleClientUserInputChange}
                required
              >
                <option value="">Seleccionar cliente *</option>
                {clients.map((client) => {
                  const editingUser = editingClientUserId ? clientUsers.find((u) => u.id === editingClientUserId) : null;
                  const editingUserClientId = editingUser?.client?.id;
                  const hasOtherUser = client.user && client.id !== editingUserClientId;
                  return (
                    <option key={client.id} value={client.id} disabled={!!hasOtherUser}>
                      {client.businessName}{hasOtherUser ? ' (ya tiene usuario)' : ''}
                    </option>
                  );
                })}
              </select>
              {editingClientUserId && (
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={editClientUserForm.active} onChange={(e) => setEditClientUserForm((p) => ({ ...p, active: e.target.checked }))} />
                  Activo
                </label>
              )}
              <div className={styles.actions}>
                <button type="submit" className={styles.buttonPrimary}>
                  {editingClientUserId ? 'Guardar cambios' : 'Crear usuario cliente'}
                </button>
                {editingClientUserId && (
                  <button type="button" onClick={cancelEditClientUser} className={styles.danger}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
            {clientUserStatus && <p className={styles.muted}>{clientUserStatus}</p>}

            <div className={styles.tableWrap}>
              {clientUsersLoading ? (
                <p className={styles.muted}>Cargando usuarios cliente...</p>
              ) : clientUsers.length === 0 ? (
                <p className={styles.muted}>Aun no hay usuarios cliente creados.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientUsers.map((clientUser) => (
                      <tr key={clientUser.id}>
                        <td>{clientUser.name}</td>
                        <td>{clientUser.email}</td>
                        <td>{clientUser.client?.businessName ?? '-'}</td>
                        <td>{clientUser.active ? 'Activo' : 'Inactivo'}</td>
                        <td className={styles.cellActions}>
                          <button type="button" onClick={() => startEditClientUser(clientUser)} className={styles.linkButton}>Editar</button>
                          <button type="button" onClick={() => handleDeleteClientUser(clientUser.id)} className={styles.danger} style={{ padding: '4px 8px', fontSize: '12px' }}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </article>
        )}

        {activeSection === 'quotes' && (
          <article className={styles.card}>
            <h3 className={styles.title}>Crear presupuesto</h3>
            <form onSubmit={handleCreateQuote} className={styles.form}>
              <select name="clientId" value={quoteForm.clientId} onChange={handleQuoteInputChange} required>
                <option value="">Seleccionar cliente *</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.businessName}
                  </option>
                ))}
              </select>
              <input name="validUntil" type="date" value={quoteForm.validUntil} onChange={handleQuoteInputChange} placeholder="Valido hasta" />
              <input name="taxPercent" type="number" min="0" max="100" step="0.01" value={quoteForm.taxPercent} onChange={handleQuoteInputChange} placeholder="Impuesto %" />
              {quoteItems.map((item, index) => (
                <article key={`quote-item-${index}`} className={styles.jobItem}>
                  <h4 className={styles.title}>Item {index + 1}</h4>
                  <input
                    value={item.description}
                    onChange={(event) => handleQuoteItemChange(index, 'description', event.target.value)}
                    placeholder="Descripcion del item *"
                    required
                  />
                  <div className={styles.row2}>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.qty}
                      onChange={(event) => handleQuoteItemChange(index, 'qty', event.target.value)}
                      placeholder="Cantidad *"
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(event) => handleQuoteItemChange(index, 'unitPrice', event.target.value)}
                      placeholder="Precio unitario *"
                      required
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => handleQuoteItemImageChange(index, event.target.files?.[0])}
                  />
                  {item.imageData && <p className={styles.muted}>Imagen cargada para este item.</p>}
                  {quoteItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuoteItem(index)}
                      className={styles.danger}
                    >
                      Eliminar item
                    </button>
                  )}
                </article>
              ))}
              <button type="button" onClick={addQuoteItem} className={styles.buttonPrimary}>
                Agregar item
              </button>
              <textarea name="notes" value={quoteForm.notes} onChange={handleQuoteInputChange} rows={3} placeholder="Notas del presupuesto" />
              <button type="submit" className={styles.buttonPrimary}>
                Crear presupuesto
              </button>
            </form>
            {quoteStatus && <p className={styles.muted}>{quoteStatus}</p>}

            {quotesLoading ? (
              <p className={styles.muted}>Cargando presupuestos...</p>
            ) : quotes.length === 0 ? (
              <p className={styles.muted}>Aun no hay presupuestos creados.</p>
            ) : (
              <div className={styles.jobsList}>
                {quotes.map((quote) => (
                  <article key={quote.id} className={styles.jobItem}>
                    <h4 className={styles.title}>Presupuesto #{quote.number}</h4>
                    <p className={styles.muted}>
                      Cliente: <strong>{quote.client?.businessName}</strong>
                    </p>
                    <p className={styles.muted}>
                      Total: <strong>${Number(quote.total).toFixed(2)}</strong>
                    </p>
                    <p className={styles.muted}>
                      Items: <strong>{quote.items?.length ?? 0}</strong>
                    </p>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => handleGenerateQuotePdf(quote.id)} className={styles.buttonPrimary}>
                        Generar PDF
                      </button>
                      <button type="button" onClick={() => handleDeleteQuote(quote.id)} className={styles.danger}>
                        Eliminar
                      </button>
                      {quote.pdfPath && (
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={async () => {
                            const url = await getQuotePdfSignedUrl(quote.id);
                            if (url) window.open(url, '_blank');
                          }}
                        >
                          Ver PDF
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        )}

        {activeSection === 'balance' && (
          <>
            <article className={styles.card}>
              <h3 className={styles.title}>Resumen de balance</h3>
              {balanceLoading ? (
                <p className={styles.muted}>Cargando balance...</p>
              ) : balance ? (
                <div className={styles.balanceSummary}>
                  <div className={styles.balanceRow}>
                    <span>Ingresos (trabajos pagados)</span>
                    <strong className={styles.positive}>${balance.ingresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className={styles.balanceRow}>
                    <span>Otros ingresos</span>
                    <strong className={styles.positive}>${balance.otrosIngresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className={styles.balanceRow}>
                    <span>Gastos por trabajos (envios, repuestos, terciarizacion)</span>
                    <strong className={styles.negative}>-${balance.gastosTrabajos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className={styles.balanceRow}>
                    <span>Gastos generales (prensa, publicidad, etc.)</span>
                    <strong className={styles.negative}>-${balance.gastosGenerales.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  {Object.keys(balance.gastosPorCategoria || {}).length > 0 && (
                    <div className={styles.balanceSub}>
                      <p className={styles.muted}>Detalle por categoria:</p>
                      {Object.entries(balance.gastosPorCategoria).map(([cat, val]) => (
                        <div key={cat} className={styles.balanceRow}>
                          <span>{cat}</span>
                          <span>${Number(val).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={`${styles.balanceRow} ${styles.balanceTotal}`}>
                    <span>Balance</span>
                    <strong className={balance.balance >= 0 ? styles.positive : styles.negative}>
                      ${balance.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              ) : (
                <p className={styles.muted}>No se pudo cargar el balance.</p>
              )}
            </article>

            <article className={styles.card}>
              <h3 className={styles.title}>Registrar gasto general</h3>
              <p className={styles.muted}>Prensa, publicidad, y otros gastos operativos.</p>
              <form onSubmit={handleAddExpense} className={styles.form}>
                <select name="category" value={expenseForm.category} onChange={handleExpenseInputChange} required>
                  <option value="PUBLICIDAD">Publicidad</option>
                  <option value="PRENSA">Prensa</option>
                  <option value="SUELDOS">Sueldos</option>
                  <option value="ALQUILER">Alquiler</option>
                  <option value="SERVICIOS">Servicios</option>
                  <option value="OTROS">Otros</option>
                </select>
                <input name="description" placeholder="Descripcion" value={expenseForm.description} onChange={handleExpenseInputChange} />
                <input name="amount" type="number" min="0" step="0.01" placeholder="Monto *" value={expenseForm.amount} onChange={handleExpenseInputChange} required />
                <input name="date" type="date" value={expenseForm.date} onChange={handleExpenseInputChange} required />
                <button type="submit" className={styles.buttonPrimary}>
                  Registrar gasto
                </button>
              </form>
              {expenseStatus && <p className={styles.muted}>{expenseStatus}</p>}
            </article>

            <article className={styles.card}>
              <h3 className={styles.title}>Gastos generales recientes</h3>
              {cashMovementsLoading ? (
                <p className={styles.muted}>Cargando...</p>
              ) : cashMovements.length === 0 ? (
                <p className={styles.muted}>Aun no hay gastos generales registrados.</p>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Categoria</th>
                        <th>Descripcion</th>
                        <th>Monto</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cashMovements.map((m) => (
                        <tr key={m.id}>
                          <td>{new Date(m.date).toLocaleDateString('es-AR')}</td>
                          <td>{m.category}</td>
                          <td>{m.description ?? '-'}</td>
                          <td className={styles.negative}>${Number(m.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                          <td>
                            <button type="button" onClick={() => handleDeleteExpense(m.id)} className={styles.danger} style={{ padding: '4px 8px', fontSize: '12px' }}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
