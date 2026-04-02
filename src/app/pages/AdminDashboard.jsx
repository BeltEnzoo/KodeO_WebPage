import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, FileText, Menu, Stethoscope, TrendingUp, UserPlus, Users } from 'lucide-react';
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
  updateQuote as apiUpdateQuote,
  generateQuotePdf as apiGenerateQuotePdf,
  deleteQuote as apiDeleteQuote,
  getQuotePdfSignedUrl,
  getCashMovements,
  createCashMovement,
  deleteCashMovement,
  getBalanceSummary,
  getEquipmentInterventions,
  createEquipmentIntervention,
  updateEquipmentIntervention,
  deleteEquipmentIntervention,
} from '../../lib/supabaseApi.js';
import styles from './AdminDashboard.module.css';

const INCOME_CATEGORY_LABELS = {
  APORTE_SUELDO_EXTERNO: 'Aporte desde otro trabajo',
  AHORROS_PERSONALES: 'Ahorros personales',
  PRESTAMO_RECIBIDO: 'Préstamo recibido',
  OTROS: 'Otros ingresos',
};

function incomeCategoryLabel(code) {
  return INCOME_CATEGORY_LABELS[code] || code;
}

const QUOTE_STATUS_LABELS = {
  DRAFT: 'Borrador',
  SENT: 'Enviado',
  NEGOTIATION: 'En negociación',
  ACCEPTED: 'Aceptado',
  REJECTED: 'Rechazado',
};

const QUOTE_PIPELINE_KEYS = ['DRAFT', 'SENT', 'NEGOTIATION', 'ACCEPTED', 'REJECTED'];

function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function isQuoteOpen(q) {
  return q.status === 'DRAFT' || q.status === 'SENT' || q.status === 'NEGOTIATION';
}

function quoteYmd(value) {
  if (value == null || value === '') return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

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
  const [quotePipelineFilter, setQuotePipelineFilter] = useState('ALL');
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceFrom, setBalanceFrom] = useState('');
  const [balanceTo, setBalanceTo] = useState('');
  const [cashMovements, setCashMovements] = useState([]);
  const [incomeMovements, setIncomeMovements] = useState([]);
  const [cashMovementsLoading, setCashMovementsLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'PUBLICIDAD',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [expenseStatus, setExpenseStatus] = useState('');
  const [incomeForm, setIncomeForm] = useState({
    category: 'APORTE_SUELDO_EXTERNO',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [incomeStatus, setIncomeStatus] = useState('');
  const [editingJobId, setEditingJobId] = useState(null);
  const [editJobForm, setEditJobForm] = useState({});
  const [editingClientId, setEditingClientId] = useState(null);
  const [editingClientUserId, setEditingClientUserId] = useState(null);
  const [editClientUserForm, setEditClientUserForm] = useState({});
  const [equipments, setEquipments] = useState([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(false);
  const [equipmentStatus, setEquipmentStatus] = useState('');
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [equipmentForm, setEquipmentForm] = useState({
    clientId: '',
    location: 'TALLER',
    equipmentName: '',
    brand: '',
    model: '',
    serialNumber: '',
    intakeDate: new Date().toISOString().slice(0, 10),
    diagnosis: '',
    technicalAction: '',
  });
  const [equipmentFilters, setEquipmentFilters] = useState({
    q: '',
    clientId: '',
    location: '',
    from: '',
    to: '',
  });

  async function loadBalance() {
    setBalanceLoading(true);
    try {
      const from = String(balanceFrom ?? '').trim();
      const to = String(balanceTo ?? '').trim();
      const data =
        from && to
          ? await getBalanceSummary({ fromDate: from, toDate: to })
          : await getBalanceSummary({});
      setBalance(data);
    } catch {
      setBalance(null);
    }
    setBalanceLoading(false);
  }

  async function loadBalanceGeneral() {
    setBalanceFrom('');
    setBalanceTo('');
    setBalanceLoading(true);
    try {
      const data = await getBalanceSummary({});
      setBalance(data);
    } catch {
      setBalance(null);
    }
    setBalanceLoading(false);
  }

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
    if (activeSection === 'equipments') {
      loadEquipments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al abrir sección; fechas con "Actualizar"
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

  async function loadCashMovements() {
    setCashMovementsLoading(true);
    try {
      const [expList, incList] = await Promise.all([
        getCashMovements({ type: 'EXPENSE' }),
        getCashMovements({ type: 'INCOME' }),
      ]);
      setCashMovements(expList);
      setIncomeMovements(incList);
    } catch (e) {
      setExpenseStatus(e.message ?? 'No se pudieron cargar movimientos de caja.');
      setIncomeStatus(e.message ?? 'No se pudieron cargar movimientos de caja.');
    }
    setCashMovementsLoading(false);
  }

  async function loadEquipments() {
    setEquipmentsLoading(true);
    try {
      const list = await getEquipmentInterventions();
      setEquipments(list);
    } catch (e) {
      setEquipmentStatus(e.message ?? 'No se pudieron cargar los equipos.');
    }
    setEquipmentsLoading(false);
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

  function handleEquipmentInputChange(event) {
    const { name, value } = event.target;
    setEquipmentForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEditEquipment(row) {
    setEditingEquipmentId(row.id);
    setEquipmentForm({
      clientId: row.client?.id ?? '',
      location: row.location ?? 'TALLER',
      equipmentName: row.equipmentName ?? '',
      brand: row.brand ?? '',
      model: row.model ?? '',
      serialNumber: row.serialNumber ?? '',
      intakeDate: row.intakeDate ? String(row.intakeDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
      diagnosis: row.diagnosis ?? '',
      technicalAction: row.technicalAction ?? '',
    });
  }

  function cancelEditEquipment() {
    setEditingEquipmentId(null);
    setEquipmentForm({
      clientId: '',
      location: 'TALLER',
      equipmentName: '',
      brand: '',
      model: '',
      serialNumber: '',
      intakeDate: new Date().toISOString().slice(0, 10),
      diagnosis: '',
      technicalAction: '',
    });
  }

  async function handleSaveEquipment(event) {
    event.preventDefault();
    setEquipmentStatus('Guardando equipo...');
    try {
      if (editingEquipmentId) {
        await updateEquipmentIntervention(editingEquipmentId, equipmentForm);
        setEquipmentStatus('Equipo actualizado.');
      } else {
        await createEquipmentIntervention(equipmentForm);
        setEquipmentStatus('Equipo registrado.');
      }
      cancelEditEquipment();
      await loadEquipments();
    } catch (e) {
      setEquipmentStatus(e.message ?? 'No se pudo guardar.');
    }
  }

  async function handleDeleteEquipment(id) {
    if (!window.confirm('¿Eliminar este registro de equipo?')) return;
    try {
      await deleteEquipmentIntervention(id);
      setEquipmentStatus('Registro eliminado.');
      if (editingEquipmentId === id) cancelEditEquipment();
      await loadEquipments();
    } catch (e) {
      setEquipmentStatus(e.message ?? 'No se pudo eliminar.');
    }
  }

  function handleEquipmentFilterChange(e) {
    const { name, value } = e.target;
    setEquipmentFilters((prev) => ({ ...prev, [name]: value }));
  }

  function normalizeText(v) {
    return String(v ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  const filteredEquipments = equipments.filter((row) => {
    if (equipmentFilters.clientId && (row.client?.id ?? '') !== equipmentFilters.clientId) return false;
    if (equipmentFilters.location && (row.location ?? '') !== equipmentFilters.location) return false;

    if (equipmentFilters.from) {
      const d = row.intakeDate ? String(row.intakeDate).slice(0, 10) : '';
      if (d && d < equipmentFilters.from) return false;
    }
    if (equipmentFilters.to) {
      const d = row.intakeDate ? String(row.intakeDate).slice(0, 10) : '';
      if (d && d > equipmentFilters.to) return false;
    }

    const q = normalizeText(equipmentFilters.q);
    if (!q) return true;
    const hay = normalizeText([
      row.equipmentName,
      row.brand,
      row.model,
      row.serialNumber,
      row.diagnosis,
      row.technicalAction,
      row.client?.businessName,
      row.location,
    ].join(' '));
    return hay.includes(q);
  });

  function exportEquipmentsCsv() {
    const headers = [
      'Fecha',
      'Ubicacion',
      'Cliente',
      'Equipo',
      'Marca',
      'Modelo',
      'Serie',
      'Diagnostico',
      'AccionTecnica',
    ];

    const rows = filteredEquipments.map((e) => [
      e.intakeDate ? String(e.intakeDate).slice(0, 10) : '',
      e.location === 'CAMPO' ? 'CAMPO' : 'TALLER',
      e.client?.businessName ?? '',
      e.equipmentName ?? '',
      e.brand ?? '',
      e.model ?? '',
      e.serialNumber ?? '',
      (e.diagnosis ?? '').replace(/\s+/g, ' ').trim(),
      (e.technicalAction ?? '').replace(/\s+/g, ' ').trim(),
    ]);

    const esc = (v) => {
      const s = String(v ?? '');
      if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const csv = [headers.join(';'), ...rows.map((r) => r.map(esc).join(';'))].join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipos_intervenidos_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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

  function handleIncomeInputChange(event) {
    const { name, value } = event.target;
    setIncomeForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddIncome(event) {
    event.preventDefault();
    setIncomeStatus('Guardando ingreso...');
    try {
      await createCashMovement({
        type: 'INCOME',
        category: incomeForm.category,
        description: incomeForm.description,
        amount: incomeForm.amount,
        date: incomeForm.date,
      });
      setIncomeForm({
        category: 'APORTE_SUELDO_EXTERNO',
        description: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
      });
      setIncomeStatus('Ingreso registrado.');
      await loadBalance();
      await loadCashMovements();
    } catch (e) {
      setIncomeStatus(e.message ?? 'No se pudo registrar el ingreso.');
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

  async function handleDeleteIncome(id) {
    if (!window.confirm('¿Eliminar este ingreso?')) return;
    try {
      await deleteCashMovement(id);
      setIncomeStatus('Ingreso eliminado.');
      await loadBalance();
      await loadCashMovements();
    } catch (e) {
      setIncomeStatus(e.message ?? 'No se pudo eliminar.');
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
      paidAt: job.paidAt ? String(job.paidAt).slice(0, 10) : '',
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

  async function patchQuote(quoteId, partial) {
    try {
      const updated = await apiUpdateQuote(quoteId, partial);
      setQuotes((prev) => prev.map((q) => (q.id === quoteId ? updated : q)));
      setQuoteStatus('');
    } catch (e) {
      setQuoteStatus(e.message ?? 'No se pudo actualizar el presupuesto.');
    }
  }

  const quoteSales = useMemo(() => {
    const today = startOfToday();
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);
    const list = quotes || [];
    const open = list.filter(isQuoteOpen);
    const expired = open.filter((q) => {
      if (!q.validUntil) return false;
      return new Date(q.validUntil) < today;
    });
    const expiringSoon = open.filter((q) => {
      if (!q.validUntil) return false;
      const v = new Date(q.validUntil);
      return v >= today && v <= in7;
    });
    const withFollowUp = open
      .filter((q) => q.followUpAt)
      .sort((a, b) => new Date(a.followUpAt) - new Date(b.followUpAt));
    const counts = { ALL: list.length };
    for (const k of QUOTE_PIPELINE_KEYS) {
      counts[k] = list.filter((q) => q.status === k).length;
    }
    return { expired, expiringSoon, withFollowUp, counts };
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    if (quotePipelineFilter === 'ALL') return quotes;
    return quotes.filter((q) => q.status === quotePipelineFilter);
  }, [quotes, quotePipelineFilter]);

  const sections = [
    { id: 'clients', label: '1) Crear cliente', icon: Users },
    { id: 'jobs', label: '2) Crear trabajo', icon: BriefcaseBusiness },
    { id: 'clientUsers', label: '3) Crear usuario cliente', icon: UserPlus },
    { id: 'quotes', label: '4) Crear presupuesto', icon: FileText },
    { id: 'balance', label: '5) Balance', icon: TrendingUp },
    { id: 'equipments', label: '6) Equipos intervenidos', icon: Stethoscope },
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
                      {job.billingStatus === 'PAID' && (
                        <p className={styles.muted}>
                          Fecha de cobro:{' '}
                          {job.paidAt
                            ? new Date(`${String(job.paidAt).slice(0, 10)}T12:00:00`).toLocaleDateString('es-AR')
                            : '—'}
                        </p>
                      )}
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
                          {editJobForm.billingStatus === 'PAID' && (
                            <label className={styles.balanceFilterLabel}>
                              Fecha de cobro
                              <input type="date" name="paidAt" value={editJobForm.paidAt || ''} onChange={handleEditJobChange} />
                            </label>
                          )}
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
          <>
            <article className={styles.card}>
              <h3 className={styles.title}>Ventas y seguimiento</h3>
              <p className={styles.muted}>
                Embudo de estados, alertas por validez y próximos contactos. Mové el estado cuando avance la venta; usá &quot;En negociación&quot; cuando haya ida y vuelta con el cliente.
              </p>
              {quotesLoading ? (
                <p className={styles.muted}>Cargando...</p>
              ) : (
                <>
                  <div className={styles.quotePipeline}>
                    <button
                      type="button"
                      className={quotePipelineFilter === 'ALL' ? styles.quotePipelineBtnActive : styles.quotePipelineBtn}
                      onClick={() => setQuotePipelineFilter('ALL')}
                    >
                      Todos ({quoteSales.counts.ALL})
                    </button>
                    {QUOTE_PIPELINE_KEYS.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={quotePipelineFilter === key ? styles.quotePipelineBtnActive : styles.quotePipelineBtn}
                        onClick={() => setQuotePipelineFilter(key)}
                      >
                        {QUOTE_STATUS_LABELS[key]} ({quoteSales.counts[key] ?? 0})
                      </button>
                    ))}
                  </div>

                  {(quoteSales.expired.length > 0 || quoteSales.expiringSoon.length > 0 || quoteSales.withFollowUp.length > 0) && (
                    <div className={styles.quoteAlerts}>
                      {quoteSales.expired.length > 0 && (
                        <div className={styles.quoteAlertBlock}>
                          <p className={styles.quoteAlertTitle}>
                            <strong className={styles.negative}>Validez vencida</strong> (abiertos — renovar o cerrar)
                          </p>
                          <ul className={styles.quoteAlertList}>
                            {quoteSales.expired.map((q) => (
                              <li key={q.id}>
                                #{q.number} · {q.client?.businessName ?? '?'}
                                {q.validUntil && (
                                  <span className={styles.muted}> — venció {new Date(q.validUntil).toLocaleDateString('es-AR')}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {quoteSales.expiringSoon.length > 0 && (
                        <div className={styles.quoteAlertBlock}>
                          <p className={styles.quoteAlertTitle}>
                            <strong className={styles.positive}>Por vencer</strong> (próximos 7 días)
                          </p>
                          <ul className={styles.quoteAlertList}>
                            {quoteSales.expiringSoon.map((q) => (
                              <li key={q.id}>
                                #{q.number} · {q.client?.businessName ?? '?'}
                                {q.validUntil && (
                                  <span className={styles.muted}> — hasta {new Date(q.validUntil).toLocaleDateString('es-AR')}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {quoteSales.withFollowUp.length > 0 && (
                        <div className={styles.quoteAlertBlock}>
                          <p className={styles.quoteAlertTitle}>
                            <strong>Próximos contactos</strong> (ordenados por fecha)
                          </p>
                          <ul className={styles.quoteAlertList}>
                            {quoteSales.withFollowUp.map((q) => (
                              <li key={q.id}>
                                #{q.number} · {q.client?.businessName ?? '?'}
                                {q.followUpAt && (
                                  <span className={styles.muted}>
                                    {' '}
                                    — seguimiento {new Date(q.followUpAt).toLocaleDateString('es-AR')}
                                    {new Date(q.followUpAt) < startOfToday() ? ' (pendiente)' : ''}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </article>

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
            </article>

            <article className={styles.card}>
              <h3 className={styles.title}>Presupuestos</h3>
              {quotesLoading ? (
                <p className={styles.muted}>Cargando presupuestos...</p>
              ) : quotes.length === 0 ? (
                <p className={styles.muted}>Aun no hay presupuestos creados.</p>
              ) : filteredQuotes.length === 0 ? (
                <p className={styles.muted}>No hay presupuestos en este filtro.</p>
              ) : (
                <div className={styles.jobsList}>
                  {filteredQuotes.map((quote) => (
                    <article key={quote.id} className={styles.jobItem}>
                      <h4 className={styles.title}>Presupuesto #{quote.number}</h4>
                      <p className={styles.muted}>
                        Cliente: <strong>{quote.client?.businessName}</strong>
                      </p>
                      <p className={styles.muted}>
                        Total: <strong>${Number(quote.total).toFixed(2)}</strong>
                        {' · '}
                        Items: <strong>{quote.items?.length ?? 0}</strong>
                      </p>
                      <div className={styles.quoteCrm}>
                        <label className={styles.balanceFilterLabel}>
                          Estado
                          <select
                            value={quote.status}
                            onChange={(e) => patchQuote(quote.id, { status: e.target.value })}
                          >
                            {QUOTE_PIPELINE_KEYS.map((key) => (
                              <option key={key} value={key}>
                                {QUOTE_STATUS_LABELS[key]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.balanceFilterLabel}>
                          Válido hasta
                          <input
                            type="date"
                            value={quoteYmd(quote.validUntil)}
                            onChange={(e) => patchQuote(quote.id, { validUntil: e.target.value || null })}
                          />
                        </label>
                        {isQuoteOpen(quote) && (
                          <>
                            <label className={styles.balanceFilterLabel}>
                              Próximo contacto
                              <input
                                type="date"
                                value={quoteYmd(quote.followUpAt)}
                                onChange={(e) => patchQuote(quote.id, { followUpAt: e.target.value || null })}
                              />
                            </label>
                            <label className={styles.balanceFilterLabel}>
                              Último contacto
                              <input
                                type="date"
                                value={quoteYmd(quote.lastContactAt)}
                                onChange={(e) => patchQuote(quote.id, { lastContactAt: e.target.value || null })}
                              />
                            </label>
                          </>
                        )}
                        {quote.status === 'REJECTED' && (
                          <label className={styles.balanceFilterLabel} style={{ gridColumn: '1 / -1' }}>
                            Motivo de cierre
                            <textarea
                              rows={2}
                              placeholder="Ej: precio, plazo, otro proveedor..."
                              defaultValue={quote.lostReason ?? ''}
                              key={`${quote.id}-lost-${quote.lostReason ?? ''}`}
                              onBlur={(e) => {
                                const v = e.target.value;
                                if (v !== (quote.lostReason ?? '')) patchQuote(quote.id, { lostReason: v });
                              }}
                            />
                          </label>
                        )}
                      </div>
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
          </>
        )}

        {activeSection === 'balance' && (
          <>
            <article className={styles.card}>
              <h3 className={styles.title}>Resumen de balance</h3>
              <p className={styles.muted}>
                Por defecto se muestra el <strong>balance general</strong> (todo el historial). Para analizar un período, completá <strong>Desde</strong> y <strong>Hasta</strong> y pulsá{' '}
                <strong>Actualizar</strong>. En un período, los ingresos por trabajos se cuentan por fecha de cobro.
              </p>
              <div className={styles.balanceFilters}>
                <label className={styles.balanceFilterLabel}>
                  Desde
                  <input type="date" value={balanceFrom} onChange={(e) => setBalanceFrom(e.target.value)} />
                </label>
                <label className={styles.balanceFilterLabel}>
                  Hasta
                  <input type="date" value={balanceTo} onChange={(e) => setBalanceTo(e.target.value)} />
                </label>
                <button type="button" className={styles.buttonPrimary} onClick={() => loadBalance()}>
                  Actualizar
                </button>
                {(balanceFrom || balanceTo) && (
                  <button type="button" className={styles.linkButton} onClick={() => loadBalanceGeneral()}>
                    Ver balance general
                  </button>
                )}
              </div>
              {balanceLoading ? (
                <p className={styles.muted}>Cargando balance...</p>
              ) : balance ? (
                <>
                  <p className={styles.muted} style={{ marginBottom: '0.75rem' }}>
                    {balance.range ? (
                      <>
                        <strong>Período:</strong>{' '}
                        {new Date(balance.range.fromDate + 'T12:00:00').toLocaleDateString('es-AR')} —{' '}
                        {new Date(balance.range.toDate + 'T12:00:00').toLocaleDateString('es-AR')}
                      </>
                    ) : (
                      <strong>Balance general</strong>
                    )}
                  </p>
                  <div className={styles.balanceSummary}>
                    <div className={styles.balanceRow}>
                      <span>
                        {balance.range
                          ? 'Ingresos (trabajos pagados, por fecha de cobro en el período)'
                          : 'Ingresos (trabajos pagados, total histórico)'}
                      </span>
                      <strong className={styles.positive}>${balance.ingresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className={styles.balanceRow}>
                      <span>
                        {balance.range ? 'Otros ingresos (en el período)' : 'Otros ingresos (total histórico)'}
                      </span>
                      <strong className={styles.positive}>${balance.otrosIngresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className={styles.balanceRow}>
                      <span>
                        {balance.range
                          ? 'Gastos por trabajos (mismos trabajos cobrados en el período)'
                          : 'Gastos por trabajos (todos los trabajos)'}
                      </span>
                      <strong className={styles.negative}>-${balance.gastosTrabajos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className={styles.balanceRow}>
                      <span>
                        {balance.range
                          ? 'Gastos generales (prensa, publicidad, etc., en el período)'
                          : 'Gastos generales (prensa, publicidad, etc., total histórico)'}
                      </span>
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

                  {balance.comparison && balance.previousPeriod && (
                    <div className={styles.balanceCompare}>
                      <h4 className={styles.balanceCompareTitle}>Vs período anterior (misma cantidad de días)</h4>
                      <p className={styles.muted}>
                        Período de referencia: {new Date(balance.previousPeriod.fromDate + 'T12:00:00').toLocaleDateString('es-AR')} —{' '}
                        {new Date(balance.previousPeriod.toDate + 'T12:00:00').toLocaleDateString('es-AR')}
                      </p>
                      <div className={styles.balanceRow}>
                        <span>Diferencia de balance</span>
                        <strong className={balance.comparison.balanceDelta >= 0 ? styles.positive : styles.negative}>
                          {balance.comparison.balanceDelta >= 0 ? '+' : ''}
                          ${balance.comparison.balanceDelta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          {balance.comparison.balancePct != null && (
                            <span className={styles.muted}> ({balance.comparison.balancePct >= 0 ? '+' : ''}
                            {balance.comparison.balancePct.toLocaleString('es-AR', { maximumFractionDigits: 1 })}%)</span>
                          )}
                        </strong>
                      </div>
                      <div className={styles.balanceRow}>
                        <span>Diferencia de ingresos (trabajos)</span>
                        <strong className={balance.comparison.ingresosDelta >= 0 ? styles.positive : styles.negative}>
                          {balance.comparison.ingresosDelta >= 0 ? '+' : ''}
                          ${balance.comparison.ingresosDelta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          {balance.comparison.ingresosPct != null && (
                            <span className={styles.muted}> ({balance.comparison.ingresosPct >= 0 ? '+' : ''}
                            {balance.comparison.ingresosPct.toLocaleString('es-AR', { maximumFractionDigits: 1 })}%)</span>
                          )}
                        </strong>
                      </div>
                    </div>
                  )}

                  {balance.monthly && balance.monthly.length > 0 && (
                    <>
                      <div className={styles.balanceChart}>
                        <h4 className={styles.balanceChartTitle}>Ingresos vs gastos por mes (en el rango)</h4>
                        <p className={styles.balanceChartLegend}>
                          <span className={styles.balanceLegendIn}>Ingresos</span>
                          <span className={styles.balanceLegendOut}>Gastos</span>
                        </p>
                        <div className={styles.balanceChartBars}>
                          {(() => {
                            const m = balance.monthly;
                            const chartMax = Math.max(
                              1,
                              ...m.map((r) =>
                                Math.max(r.ingresos + r.otrosIngresos, r.gastosTrabajos + r.gastosGenerales)
                              )
                            );
                            return m.map((row) => {
                              const totalIn = row.ingresos + row.otrosIngresos;
                              const totalOut = row.gastosTrabajos + row.gastosGenerales;
                              const hIn = Math.round((totalIn / chartMax) * 100);
                              const hOut = Math.round((totalOut / chartMax) * 100);
                              return (
                                <div key={row.month} className={styles.balanceChartCol}>
                                  <div className={styles.balanceChartPair}>
                                    <div
                                      className={`${styles.balanceBar} ${styles.balanceBarIn}`}
                                      style={{ height: `${hIn}%` }}
                                      title={`Ingresos ${totalIn}`}
                                    />
                                    <div
                                      className={`${styles.balanceBar} ${styles.balanceBarOut}`}
                                      style={{ height: `${hOut}%` }}
                                      title={`Gastos ${totalOut}`}
                                    />
                                  </div>
                                  <span className={styles.balanceChartColLabel}>{row.label}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      <div className={styles.tableWrap} style={{ marginTop: '1rem' }}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Mes</th>
                              <th>Ingresos trab.</th>
                              <th>Otros ing.</th>
                              <th>Gastos trab.</th>
                              <th>Gastos gral.</th>
                              <th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {balance.monthly.map((row) => (
                              <tr key={row.month}>
                                <td>{row.label}</td>
                                <td className={styles.positive}>${row.ingresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                <td className={styles.positive}>${row.otrosIngresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                <td className={styles.negative}>${row.gastosTrabajos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                <td className={styles.negative}>${row.gastosGenerales.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                <td className={row.balance >= 0 ? styles.positive : styles.negative}>
                                  ${row.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
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
              <h3 className={styles.title}>Registrar ingreso general</h3>
              <p className={styles.muted}>
                Aportes de capital, dinero desde otro trabajo u otros ingresos que no vienen de trabajos facturados. Se suman en el balance como &quot;Otros ingresos&quot;.
              </p>
              <form onSubmit={handleAddIncome} className={styles.form}>
                <select name="category" value={incomeForm.category} onChange={handleIncomeInputChange} required>
                  <option value="APORTE_SUELDO_EXTERNO">{INCOME_CATEGORY_LABELS.APORTE_SUELDO_EXTERNO}</option>
                  <option value="AHORROS_PERSONALES">{INCOME_CATEGORY_LABELS.AHORROS_PERSONALES}</option>
                  <option value="PRESTAMO_RECIBIDO">{INCOME_CATEGORY_LABELS.PRESTAMO_RECIBIDO}</option>
                  <option value="OTROS">{INCOME_CATEGORY_LABELS.OTROS}</option>
                </select>
                <input name="description" placeholder="Detalle (ej: aporte marzo, parte sueldo hospital X)" value={incomeForm.description} onChange={handleIncomeInputChange} />
                <input name="amount" type="number" min="0" step="0.01" placeholder="Monto *" value={incomeForm.amount} onChange={handleIncomeInputChange} required />
                <input name="date" type="date" value={incomeForm.date} onChange={handleIncomeInputChange} required />
                <button type="submit" className={styles.buttonPrimary}>
                  Registrar ingreso
                </button>
              </form>
              {incomeStatus && <p className={styles.muted}>{incomeStatus}</p>}
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

            <article className={styles.card}>
              <h3 className={styles.title}>Ingresos generales recientes</h3>
              {cashMovementsLoading ? (
                <p className={styles.muted}>Cargando...</p>
              ) : incomeMovements.length === 0 ? (
                <p className={styles.muted}>Aun no hay ingresos generales registrados.</p>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Categoria</th>
                        <th>Detalle</th>
                        <th>Monto</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeMovements.map((m) => (
                        <tr key={m.id}>
                          <td>{new Date(m.date).toLocaleDateString('es-AR')}</td>
                          <td>{incomeCategoryLabel(m.category)}</td>
                          <td>{m.description ?? '-'}</td>
                          <td className={styles.positive}>${Number(m.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                          <td>
                            <button type="button" onClick={() => handleDeleteIncome(m.id)} className={styles.danger} style={{ padding: '4px 8px', fontSize: '12px' }}>
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

        {activeSection === 'equipments' && (
          <>
            <article className={styles.card}>
              <h3 className={styles.title}>{editingEquipmentId ? 'Editar equipo intervenido' : 'Registrar equipo intervenido'}</h3>
              <form onSubmit={handleSaveEquipment} className={styles.form}>
                <select name="clientId" value={equipmentForm.clientId} onChange={handleEquipmentInputChange}>
                  <option value="">Sin cliente (opcional)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.businessName}</option>
                  ))}
                </select>
                <div className={styles.row2}>
                  <select name="location" value={equipmentForm.location} onChange={handleEquipmentInputChange}>
                    <option value="TALLER">Taller</option>
                    <option value="CAMPO">Campo (hospital)</option>
                  </select>
                  <input name="intakeDate" type="date" value={equipmentForm.intakeDate} onChange={handleEquipmentInputChange} />
                </div>
                <input name="equipmentName" placeholder="Nombre de equipo * (ej: Autoclave, Centrífuga)" value={equipmentForm.equipmentName} onChange={handleEquipmentInputChange} required />
                <div className={styles.row3}>
                  <input name="brand" placeholder="Marca" value={equipmentForm.brand} onChange={handleEquipmentInputChange} />
                  <input name="model" placeholder="Modelo" value={equipmentForm.model} onChange={handleEquipmentInputChange} />
                  <input name="serialNumber" placeholder="N° de serie" value={equipmentForm.serialNumber} onChange={handleEquipmentInputChange} />
                </div>
                <textarea name="diagnosis" placeholder="Diagnóstico de ingreso" value={equipmentForm.diagnosis} onChange={handleEquipmentInputChange} rows={3} />
                <textarea name="technicalAction" placeholder="Acción técnica realizada" value={equipmentForm.technicalAction} onChange={handleEquipmentInputChange} rows={3} />
                <div className={styles.actions}>
                  <button type="submit" className={styles.buttonPrimary}>
                    {editingEquipmentId ? 'Guardar cambios' : 'Registrar equipo'}
                  </button>
                  {editingEquipmentId && (
                    <button type="button" onClick={cancelEditEquipment} className={styles.danger}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
              {equipmentStatus && <p className={styles.muted}>{equipmentStatus}</p>}
            </article>

            <article className={styles.card}>
              <h3 className={styles.title}>Equipos intervenidos</h3>
              {equipmentsLoading ? (
                <p className={styles.muted}>Cargando...</p>
              ) : equipments.length === 0 ? (
                <p className={styles.muted}>Aún no hay registros.</p>
              ) : (
                <>
                  <div className={styles.filtersBar}>
                    <input
                      name="q"
                      placeholder="Buscar (equipo, marca, modelo, serie, diagnóstico...)"
                      value={equipmentFilters.q}
                      onChange={handleEquipmentFilterChange}
                    />
                    <select name="clientId" value={equipmentFilters.clientId} onChange={handleEquipmentFilterChange}>
                      <option value="">Todos los clientes</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.businessName}</option>
                      ))}
                    </select>
                    <select name="location" value={equipmentFilters.location} onChange={handleEquipmentFilterChange}>
                      <option value="">Taller + Campo</option>
                      <option value="TALLER">Solo taller</option>
                      <option value="CAMPO">Solo campo</option>
                    </select>
                    <input name="from" type="date" value={equipmentFilters.from} onChange={handleEquipmentFilterChange} />
                    <input name="to" type="date" value={equipmentFilters.to} onChange={handleEquipmentFilterChange} />
                    <button type="button" className={styles.buttonPrimary} onClick={exportEquipmentsCsv}>
                      Exportar CSV
                    </button>
                  </div>
                  <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
                    Mostrando <strong>{filteredEquipments.length}</strong> de <strong>{equipments.length}</strong>
                  </p>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Ubicación</th>
                        <th>Equipo</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Serie</th>
                        <th>Cliente</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEquipments.map((e) => (
                        <tr key={e.id}>
                          <td>{e.intakeDate ? new Date(e.intakeDate).toLocaleDateString('es-AR') : '-'}</td>
                          <td>{e.location === 'CAMPO' ? 'Campo' : 'Taller'}</td>
                          <td>{e.equipmentName}</td>
                          <td>{e.brand ?? '-'}</td>
                          <td>{e.model ?? '-'}</td>
                          <td>{e.serialNumber ?? '-'}</td>
                          <td>{e.client?.businessName ?? '-'}</td>
                          <td className={styles.cellActions}>
                            <button type="button" onClick={() => startEditEquipment(e)} className={styles.linkButton}>Editar</button>
                            <button type="button" onClick={() => handleDeleteEquipment(e.id)} className={styles.danger} style={{ padding: '4px 8px', fontSize: '12px' }}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </>
              )}
            </article>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
