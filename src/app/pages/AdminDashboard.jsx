import { useEffect, useState } from 'react';
import { BriefcaseBusiness, FileText, Menu, UserPlus, Users } from 'lucide-react';
import { API_BASE_URL, apiRequest } from '../services/api.js';
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

  useEffect(() => {
    async function loadMe() {
      const { response, payload } = await apiRequest('/api/auth/me', { method: 'GET' });
      if (!response.ok || payload?.user?.role !== 'ADMIN') {
        window.location.href = '/login';
        return;
      }

      setUser(payload.user);
      setStatus('Panel listo.');
      await loadClients();
      await loadJobs();
      await loadClientUsers();
      await loadQuotes();
    }

    loadMe();
  }, []);

  async function loadClients() {
    setClientsLoading(true);
    const { response, payload } = await apiRequest('/api/clients', { method: 'GET' });
    if (!response.ok) {
      setFormStatus(payload?.error ?? 'No se pudo cargar clientes.');
      setClientsLoading(false);
      return;
    }
    setClients(payload.clients ?? []);
    setClientsLoading(false);
  }

  async function loadJobs() {
    setJobsLoading(true);
    const { response, payload } = await apiRequest('/api/jobs', { method: 'GET' });
    if (!response.ok) {
      setJobFormStatus(payload?.error ?? 'No se pudo cargar trabajos.');
      setJobsLoading(false);
      return;
    }
    setJobs(payload.jobs ?? []);
    setJobsLoading(false);
  }

  async function loadClientUsers() {
    setClientUsersLoading(true);
    const { response, payload } = await apiRequest('/api/client-users', { method: 'GET' });
    if (!response.ok) {
      setClientUserStatus(payload?.error ?? 'No se pudo cargar usuarios cliente.');
      setClientUsersLoading(false);
      return;
    }
    setClientUsers(payload.users ?? []);
    setClientUsersLoading(false);
  }

  async function loadQuotes() {
    setQuotesLoading(true);
    const { response, payload } = await apiRequest('/api/quotes', { method: 'GET' });
    if (!response.ok) {
      setQuoteStatus(payload?.error ?? 'No se pudo cargar presupuestos.');
      setQuotesLoading(false);
      return;
    }
    setQuotes(payload.quotes ?? []);
    setQuotesLoading(false);
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

  async function handleCreateClient(event) {
    event.preventDefault();
    setFormStatus('Guardando cliente...');

    const { response, payload } = await apiRequest('/api/clients', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setFormStatus(payload?.error ?? 'No se pudo crear el cliente.');
      return;
    }

    setForm({
      businessName: '',
      cuit: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    });
    setFormStatus('Cliente creado correctamente.');
    await loadClients();
  }

  async function handleLogout() {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  async function handleCreateJob(event) {
    event.preventDefault();
    setJobFormStatus('Guardando trabajo...');

    const { response, payload } = await apiRequest('/api/jobs', {
      method: 'POST',
      body: JSON.stringify({
        ...jobForm,
        amount: jobForm.amount === '' ? undefined : Number(jobForm.amount),
      }),
    });

    if (!response.ok) {
      setJobFormStatus(payload?.error ?? 'No se pudo crear el trabajo.');
      return;
    }

    setJobForm({
      clientId: '',
      title: '',
      description: '',
      amount: '',
      workStatus: 'PENDING',
      billingStatus: 'NOT_INVOICED',
    });
    setJobFormStatus('Trabajo creado correctamente.');
    await loadJobs();
    await loadClients();
  }

  async function handleUpdateJobStatus(jobId, updates) {
    const { response, payload } = await apiRequest(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      setJobFormStatus(payload?.error ?? 'No se pudo actualizar estado.');
      return;
    }

    setJobs((prev) => prev.map((job) => (job.id === jobId ? payload.job : job)));
    await loadClients();
  }

  async function handleCreateClientUser(event) {
    event.preventDefault();
    setClientUserStatus('Creando usuario cliente...');

    const { response, payload } = await apiRequest('/api/client-users', {
      method: 'POST',
      body: JSON.stringify(clientUserForm),
    });

    if (!response.ok) {
      setClientUserStatus(payload?.error ?? 'No se pudo crear el usuario cliente.');
      return;
    }

    setClientUserForm({
      name: '',
      email: '',
      password: '',
      clientId: '',
    });
    setClientUserStatus('Usuario cliente creado correctamente.');
    await loadClientUsers();
    await loadClients();
  }

  async function handleCreateQuote(event) {
    event.preventDefault();
    setQuoteStatus('Creando presupuesto...');

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

    const { response, payload: responsePayload } = await apiRequest('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setQuoteStatus(responsePayload?.error ?? 'No se pudo crear el presupuesto.');
      return;
    }

    setQuoteForm({
      clientId: '',
      validUntil: '',
      taxPercent: '0',
      notes: '',
    });
    setQuoteItems([{ description: '', qty: '1', unitPrice: '', imageData: '' }]);
    setQuoteStatus(`Presupuesto #${responsePayload.quote.number} creado.`);
    await loadQuotes();
  }

  async function handleGenerateQuotePdf(quoteId) {
    setQuoteStatus('Generando PDF...');
    const { response, payload } = await apiRequest(`/api/quotes/${quoteId}/generate-pdf`, {
      method: 'POST',
    });

    if (!response.ok) {
      setQuoteStatus(payload?.error ?? 'No se pudo generar el PDF.');
      return;
    }

    setQuoteStatus('PDF generado correctamente.');
    await loadQuotes();
    window.open(`${API_BASE_URL}${payload.downloadUrl}`, '_blank');
  }

  async function handleDeleteQuote(quoteId) {
    const confirmed = window.confirm('Se eliminara el presupuesto y su PDF generado. Continuar?');
    if (!confirmed) {
      return;
    }

    const { response, payload } = await apiRequest(`/api/quotes/${quoteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setQuoteStatus(payload?.error ?? 'No se pudo eliminar el presupuesto.');
      return;
    }

    setQuoteStatus('Presupuesto eliminado correctamente.');
    await loadQuotes();
  }

  const sections = [
    { id: 'clients', label: '1) Crear cliente', icon: Users },
    { id: 'jobs', label: '2) Crear trabajo', icon: BriefcaseBusiness },
    { id: 'clientUsers', label: '3) Crear usuario cliente', icon: UserPlus },
    { id: 'quotes', label: '4) Crear presupuesto', icon: FileText },
  ];

  return (
    <main className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Panel Owner</h2>
        <p className={styles.sidebarSubtitle}>{status}</p>
        {user && (
          <p className={styles.sidebarSubtitle}>
            Sesion: <strong>{user.name}</strong>
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
              <h3 className={styles.title}>Crear cliente</h3>
              <form onSubmit={handleCreateClient} className={styles.form}>
                <input name="businessName" placeholder="Razon social *" value={form.businessName} onChange={handleInputChange} required />
                <input name="cuit" placeholder="CUIT" value={form.cuit} onChange={handleInputChange} />
                <input name="phone" placeholder="Telefono" value={form.phone} onChange={handleInputChange} />
                <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleInputChange} />
                <input name="address" placeholder="Direccion" value={form.address} onChange={handleInputChange} />
                <textarea name="notes" placeholder="Notas" value={form.notes} onChange={handleInputChange} rows={3} />
                <button type="submit" className={styles.buttonPrimary}>
                  Crear cliente
                </button>
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
                <input name="amount" type="number" min="0" step="0.01" placeholder="Monto" value={jobForm.amount} onChange={handleJobInputChange} />
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
                      <p className={styles.muted}>Monto: {job.amount != null ? `$${Number(job.amount).toFixed(2)}` : '-'}</p>
                      <div className={styles.row2}>
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
            <h3 className={styles.title}>Crear usuario cliente</h3>
            <form onSubmit={handleCreateClientUser} className={styles.form}>
              <input name="name" placeholder="Nombre *" value={clientUserForm.name} onChange={handleClientUserInputChange} required />
              <input name="email" type="email" placeholder="Email de acceso *" value={clientUserForm.email} onChange={handleClientUserInputChange} required />
              <input name="password" type="password" placeholder="Contrasena inicial *" value={clientUserForm.password} onChange={handleClientUserInputChange} required />
              <select name="clientId" value={clientUserForm.clientId} onChange={handleClientUserInputChange} required>
                <option value="">Seleccionar cliente *</option>
                {clients
                  .filter((client) => !client.user)
                  .map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.businessName}
                    </option>
                  ))}
              </select>
              <button type="submit" className={styles.buttonPrimary}>
                Crear usuario cliente
              </button>
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
                    </tr>
                  </thead>
                  <tbody>
                    {clientUsers.map((clientUser) => (
                      <tr key={clientUser.id}>
                        <td>{clientUser.name}</td>
                        <td>{clientUser.email}</td>
                        <td>{clientUser.client?.businessName ?? '-'}</td>
                        <td>{clientUser.active ? 'Activo' : 'Inactivo'}</td>
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
                        <a href={`${API_BASE_URL}/api/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer" className={styles.link}>
                          Ver PDF
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
