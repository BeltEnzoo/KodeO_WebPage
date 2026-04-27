/**
 * Capa de API para Supabase - mapea snake_case de DB a camelCase para el frontend
 */
import { supabase } from './supabase.js';

function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(mapKeys);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [toCamel(k), mapKeys(v)])
  );
}

// --- Auth ---
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session;
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  return mapKeys(data);
}

export async function signOut() {
  await supabase.auth.signOut();
}

// --- Clients ---
export async function getClients() {
  const { data, error } = await supabase
    .from('clients_with_stats')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  const clients = (data || []).map((c) => ({
    id: c.id,
    businessName: c.business_name,
    cuit: c.cuit,
    address: c.address,
    phone: c.phone,
    email: c.email,
    notes: c.notes,
    user: c.user_email ? { email: c.user_email } : null,
    _count: { jobs: c.jobs_count ?? 0 },
  }));
  return clients;
}

export async function createClient(data) {
  const { data: row, error } = await supabase
    .from('clients')
    .insert({
      business_name: data.businessName,
      cuit: data.cuit || null,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('Ya existe un cliente con ese CUIT.');
    throw new Error(error.message);
  }
  return mapKeys(row);
}

export async function updateClient(clientId, data) {
  const { data: row, error } = await supabase
    .from('clients')
    .update({
      business_name: data.businessName,
      cuit: data.cuit || null,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      notes: data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', clientId)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('Ya existe un cliente con ese CUIT.');
    throw new Error(error.message);
  }
  return mapKeys(row);
}

export async function deleteClient(clientId) {
  const { error } = await supabase.from('clients').delete().eq('id', clientId);
  if (error) throw new Error(error.message);
}

// --- Providers ---
export async function getProviders() {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .order('business_name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapKeys);
}

export async function createProvider(payload) {
  const { data, error } = await supabase
    .from('providers')
    .insert({
      business_name: payload.businessName,
      specialty: payload.specialty || null,
      contact_name: payload.contactName || null,
      phone: payload.phone || null,
      email: payload.email || null,
      notes: payload.notes || null,
      active: payload.active ?? true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapKeys(data);
}

export async function updateProvider(id, updates) {
  const payload = { updated_at: new Date().toISOString() };
  if (updates.businessName !== undefined) payload.business_name = updates.businessName;
  if (updates.specialty !== undefined) payload.specialty = updates.specialty || null;
  if (updates.contactName !== undefined) payload.contact_name = updates.contactName || null;
  if (updates.phone !== undefined) payload.phone = updates.phone || null;
  if (updates.email !== undefined) payload.email = updates.email || null;
  if (updates.notes !== undefined) payload.notes = updates.notes || null;
  if (updates.active !== undefined) payload.active = !!updates.active;

  const { data, error } = await supabase
    .from('providers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapKeys(data);
}

export async function deleteProvider(id) {
  const { error } = await supabase.from('providers').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// --- Jobs ---
export async function getJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((j) => ({
    ...mapKeys(j),
    client: j.client ? { id: j.client.id, businessName: j.client.business_name } : null,
  }));
}

export async function getMyJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      client:clients(business_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((j) => ({
    ...mapKeys(j),
    client: j.client ? { businessName: j.client.business_name } : null,
  }));
}

export async function createJob(data) {
  const billingStatus = data.billingStatus ?? 'NOT_INVOICED';
  const insertPayload = {
    client_id: data.clientId,
    title: data.title,
    description: data.description || null,
    work_status: data.workStatus ?? 'PENDING',
    billing_status: billingStatus,
    amount: data.amount != null && data.amount !== '' ? Number(data.amount) : null,
    expense_shipping: Number(data.expenseShipping ?? 0) || 0,
    expense_repuestos: Number(data.expenseRepuestos ?? 0) || 0,
    expense_terciarizacion: Number(data.expenseTerciarizacion ?? 0) || 0,
  };
  if (billingStatus === 'PAID' && data.paidAt) insertPayload.paid_at = data.paidAt;

  const { data: row, error } = await supabase
    .from('jobs')
    .insert(insertPayload)
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .single();

  if (error) {
    if (error.code === '23503') throw new Error('Cliente inválido.');
    throw new Error(error.message);
  }
  return {
    ...mapKeys(row),
    client: row.client ? { id: row.client.id, businessName: row.client.business_name } : null,
  };
}

export async function updateJob(jobId, updates) {
  const payload = { updated_at: new Date().toISOString() };
  if (updates.clientId != null && updates.clientId !== '') payload.client_id = updates.clientId;
  if (updates.title != null) payload.title = updates.title;
  if (updates.description != null) payload.description = updates.description;
  if (updates.workStatus != null) payload.work_status = updates.workStatus;
  if (updates.billingStatus != null) payload.billing_status = updates.billingStatus;
  if (updates.amount != null) payload.amount = updates.amount === '' ? null : Number(updates.amount);
  if (updates.expenseShipping != null) payload.expense_shipping = Number(updates.expenseShipping ?? 0);
  if (updates.expenseRepuestos != null) payload.expense_repuestos = Number(updates.expenseRepuestos ?? 0);
  if (updates.expenseTerciarizacion != null) payload.expense_terciarizacion = Number(updates.expenseTerciarizacion ?? 0);
  if (updates.paidAt !== undefined && updates.paidAt !== '' && updates.paidAt != null) {
    payload.paid_at = updates.paidAt;
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(payload)
    .eq('id', jobId)
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .single();

  if (error) throw new Error(error.message);
  return {
    ...mapKeys(data),
    client: data.client ? { id: data.client.id, businessName: data.client.business_name } : null,
  };
}

export async function deleteJob(jobId) {
  const { error } = await supabase.from('jobs').delete().eq('id', jobId);
  if (error) throw new Error(error.message);
}

// --- Client Users ---
export async function getClientUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      active,
      client:clients(id, business_name)
    `)
    .eq('role', 'CLIENT')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    active: u.active,
    client: u.client ? { id: u.client.id, businessName: u.client.business_name } : null,
  }));
}

export async function createClientUser(data) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: fnData, error } = await supabase.functions.invoke('create-client-user', {
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      clientId: data.clientId,
    },
    headers: session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {},
  });

  if (error) throw new Error(error.message);
  if (fnData?.error) throw new Error(fnData.error);
  return fnData?.user ?? fnData;
}

export async function updateClientUser(userId, data) {
  const payload = { updated_at: new Date().toISOString() };
  if (data.name != null) payload.name = data.name;
  if (data.active != null) payload.active = !!data.active;
  if (data.clientId != null) payload.client_id = data.clientId;

  const { data: row, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .eq('role', 'CLIENT')
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapKeys(row);
}

export async function deleteClientUser(userId) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: fnData, error } = await supabase.functions.invoke('delete-client-user', {
    body: { userId },
    headers: session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {},
  });

  if (error) throw new Error(error.message);
  if (fnData?.error) throw new Error(fnData.error);
}

// --- Quotes ---
export async function getQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      client:clients(id, business_name),
      items:quote_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((q) => ({
    ...mapKeys(q),
    client: q.client ? { id: q.client.id, businessName: q.client.business_name } : null,
    items: (q.items || []).map(mapKeys),
  }));
}

export async function createQuote(payload) {
  const items = payload.items.map((item) => ({
    description: item.description,
    qty: Number(item.qty || 1),
    unit_price: Number(item.unitPrice || 0),
    line_total: Number((Number(item.qty || 1) * Number(item.unitPrice || 0)).toFixed(2)),
    image_data: item.imageData || null,
  }));

  const subtotal = items.reduce((acc, i) => acc + i.line_total, 0);
  const taxPercent = Number(payload.taxPercent || 0);
  const tax = Number((subtotal * (taxPercent / 100)).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert({
      client_id: payload.clientId,
      valid_until: payload.validUntil || null,
      notes: payload.notes || null,
      subtotal,
      tax,
      total,
    })
    .select()
    .single();

  if (quoteError) {
    if (quoteError.code === '23503') throw new Error('Cliente inválido.');
    throw new Error(quoteError.message);
  }

  const quoteItems = items.map((it) => ({ ...it, quote_id: quote.id }));
  const { error: itemsError } = await supabase.from('quote_items').insert(quoteItems);
  if (itemsError) {
    await supabase.from('quotes').delete().eq('id', quote.id);
    throw new Error(itemsError.message);
  }

  const { data: fullQuote } = await supabase
    .from('quotes')
    .select(`
      *,
      client:clients(id, business_name),
      items:quote_items(*)
    `)
    .eq('id', quote.id)
    .single();

  return {
    ...mapKeys(fullQuote || quote),
    client: fullQuote?.client ? { id: fullQuote.client.id, businessName: fullQuote.client.business_name } : null,
    items: (fullQuote?.items || []).map(mapKeys),
  };
}

export async function updateQuote(quoteId, updates) {
  const payload = { updated_at: new Date().toISOString() };
  if (updates.status != null) payload.status = updates.status;
  if (updates.followUpAt !== undefined) {
    payload.follow_up_at = updates.followUpAt === '' || updates.followUpAt == null ? null : updates.followUpAt;
  }
  if (updates.lastContactAt !== undefined) {
    payload.last_contact_at = updates.lastContactAt === '' || updates.lastContactAt == null ? null : updates.lastContactAt;
  }
  if (updates.lostReason !== undefined) payload.lost_reason = updates.lostReason || null;
  if (updates.validUntil !== undefined) {
    payload.valid_until = updates.validUntil ? new Date(updates.validUntil).toISOString() : null;
  }
  if (updates.notes !== undefined) payload.notes = updates.notes || null;

  const { data, error } = await supabase
    .from('quotes')
    .update(payload)
    .eq('id', quoteId)
    .select(`
      *,
      client:clients(id, business_name),
      items:quote_items(*)
    `)
    .single();

  if (error) throw new Error(error.message);
  return {
    ...mapKeys(data),
    client: data.client ? { id: data.client.id, businessName: data.client.business_name } : null,
    items: (data.items || []).map(mapKeys),
  };
}

export async function generateQuotePdf(quoteId) {
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error } = await supabase.functions.invoke('generate-quote-pdf', {
    body: { quoteId },
    headers: session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {},
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function deleteQuote(quoteId) {
  const { error } = await supabase.from('quotes').delete().eq('id', quoteId);
  if (error) throw new Error(error.message);
}

export async function getQuotePdfSignedUrl(quoteId) {
  const { data, error } = await supabase.storage
    .from('quote-pdfs')
    .createSignedUrl(`quotes/${quoteId}.pdf`, 3600); // 1 hora
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

// --- Cash Movements (gastos generales: prensa, publicidad, etc.) ---
export async function getCashMovements(filters = {}) {
  let q = supabase
    .from('cash_movements')
    .select('*')
    .order('date', { ascending: false });

  if (filters.type) q = q.eq('type', filters.type);
  if (filters.category) q = q.eq('category', filters.category);
  if (filters.fromDate) q = q.gte('date', filters.fromDate);
  if (filters.toDate) q = q.lte('date', filters.toDate);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data || []).map(mapKeys);
}

export async function createCashMovement(data) {
  const { data: row, error } = await supabase
    .from('cash_movements')
    .insert({
      type: data.type || 'EXPENSE',
      category: data.category,
      description: data.description || null,
      amount: Number(data.amount || 0),
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      payment_method: data.paymentMethod || null,
      related_job_id: data.relatedJobId || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapKeys(row);
}

export async function deleteCashMovement(id) {
  const { error } = await supabase.from('cash_movements').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// --- Accessory sales (ventas de accesorios) ---
export async function getAccessorySales() {
  const { data, error } = await supabase
    .from('accessory_sales')
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .order('sale_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    ...mapKeys(row),
    client: row.client ? { id: row.client.id, businessName: row.client.business_name } : null,
  }));
}

export async function createAccessorySale(payload) {
  const saleDateIso = payload.saleDate ? new Date(payload.saleDate).toISOString() : new Date().toISOString();
  const acquisitionDateIso = payload.acquisitionDate ? new Date(payload.acquisitionDate).toISOString() : new Date().toISOString();
  const saleDescription = `Venta accesorio: ${payload.accessoryName} (${payload.equipmentName})`;
  const acquisitionDescription = `Compra accesorio: ${payload.accessoryName} (${payload.equipmentName})`;

  const { data: acquisitionMovement, error: acqErr } = await supabase
    .from('cash_movements')
    .insert({
      type: 'EXPENSE',
      category: 'ACCESORIOS',
      description: acquisitionDescription,
      amount: Number(payload.acquisitionCost || 0),
      date: acquisitionDateIso,
    })
    .select()
    .single();
  if (acqErr) throw new Error(acqErr.message);

  const { data: saleMovement, error: saleErr } = await supabase
    .from('cash_movements')
    .insert({
      type: 'INCOME',
      category: 'VENTA_ACCESORIOS',
      description: saleDescription,
      amount: Number(payload.salePrice || 0),
      date: saleDateIso,
    })
    .select()
    .single();

  if (saleErr) {
    await supabase.from('cash_movements').delete().eq('id', acquisitionMovement.id);
    throw new Error(saleErr.message);
  }

  const { data, error } = await supabase
    .from('accessory_sales')
    .insert({
      accessory_name: payload.accessoryName,
      equipment_name: payload.equipmentName,
      client_id: payload.clientId || null,
      acquisition_cost: Number(payload.acquisitionCost || 0),
      acquisition_date: payload.acquisitionDate,
      sale_price: Number(payload.salePrice || 0),
      sale_date: payload.saleDate,
      notes: payload.notes || null,
      acquisition_movement_id: acquisitionMovement.id,
      sale_movement_id: saleMovement.id,
      updated_at: new Date().toISOString(),
    })
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .single();

  if (error) {
    await supabase.from('cash_movements').delete().eq('id', acquisitionMovement.id);
    await supabase.from('cash_movements').delete().eq('id', saleMovement.id);
    throw new Error(error.message);
  }

  return {
    ...mapKeys(data),
    client: data.client ? { id: data.client.id, businessName: data.client.business_name } : null,
  };
}

export async function updateAccessorySale(id, updates) {
  const { data: current, error: currentErr } = await supabase
    .from('accessory_sales')
    .select('*')
    .eq('id', id)
    .single();
  if (currentErr) throw new Error(currentErr.message);

  const next = {
    accessoryName: updates.accessoryName ?? current.accessory_name,
    equipmentName: updates.equipmentName ?? current.equipment_name,
    clientId: updates.clientId !== undefined ? (updates.clientId || null) : current.client_id,
    acquisitionCost: updates.acquisitionCost ?? current.acquisition_cost,
    acquisitionDate: updates.acquisitionDate ?? current.acquisition_date,
    salePrice: updates.salePrice ?? current.sale_price,
    saleDate: updates.saleDate ?? current.sale_date,
    notes: updates.notes !== undefined ? updates.notes : current.notes,
  };

  const saleDescription = `Venta accesorio: ${next.accessoryName} (${next.equipmentName})`;
  const acquisitionDescription = `Compra accesorio: ${next.accessoryName} (${next.equipmentName})`;

  if (current.acquisition_movement_id) {
    const { error: acqMovErr } = await supabase
      .from('cash_movements')
      .update({
        category: 'ACCESORIOS',
        description: acquisitionDescription,
        amount: Number(next.acquisitionCost || 0),
        date: new Date(next.acquisitionDate).toISOString(),
      })
      .eq('id', current.acquisition_movement_id);
    if (acqMovErr) throw new Error(acqMovErr.message);
  }

  if (current.sale_movement_id) {
    const { error: saleMovErr } = await supabase
      .from('cash_movements')
      .update({
        category: 'VENTA_ACCESORIOS',
        description: saleDescription,
        amount: Number(next.salePrice || 0),
        date: new Date(next.saleDate).toISOString(),
      })
      .eq('id', current.sale_movement_id);
    if (saleMovErr) throw new Error(saleMovErr.message);
  }

  const { data, error } = await supabase
    .from('accessory_sales')
    .update({
      accessory_name: next.accessoryName,
      equipment_name: next.equipmentName,
      client_id: next.clientId,
      acquisition_cost: Number(next.acquisitionCost || 0),
      acquisition_date: next.acquisitionDate,
      sale_price: Number(next.salePrice || 0),
      sale_date: next.saleDate,
      notes: next.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .single();

  if (error) throw new Error(error.message);
  return {
    ...mapKeys(data),
    client: data.client ? { id: data.client.id, businessName: data.client.business_name } : null,
  };
}

export async function deleteAccessorySale(id) {
  const { data: row, error: getErr } = await supabase
    .from('accessory_sales')
    .select('id, acquisition_movement_id, sale_movement_id')
    .eq('id', id)
    .single();
  if (getErr) throw new Error(getErr.message);

  const { error } = await supabase.from('accessory_sales').delete().eq('id', id);
  if (error) throw new Error(error.message);

  if (row.acquisition_movement_id) {
    await supabase.from('cash_movements').delete().eq('id', row.acquisition_movement_id);
  }
  if (row.sale_movement_id) {
    await supabase.from('cash_movements').delete().eq('id', row.sale_movement_id);
  }
}

// --- Balance (resumen financiero) ---
function pad2(n) {
  return String(n).padStart(2, '0');
}

function addDaysYmd(ymd, delta) {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function daysBetweenInclusive(from, to) {
  const a = new Date(`${from}T12:00:00`);
  const b = new Date(`${to}T12:00:00`);
  return Math.round((b - a) / (24 * 60 * 60 * 1000)) + 1;
}

function previousPeriod(fromDate, toDate) {
  const len = daysBetweenInclusive(fromDate, toDate);
  const prevTo = addDaysYmd(fromDate, -1);
  const prevFrom = addDaysYmd(prevTo, -(len - 1));
  return { fromDate: prevFrom, toDate: prevTo };
}

function monthKeysInRange(fromDate, toDate) {
  const keys = [];
  const y = +fromDate.slice(0, 4);
  const m = +fromDate.slice(5, 7) - 1;
  const end = new Date(+toDate.slice(0, 4), +toDate.slice(5, 7) - 1, +toDate.slice(8, 10));
  let cur = new Date(y, m, 1);
  while (cur <= end) {
    keys.push(`${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}`);
    cur.setMonth(cur.getMonth() + 1);
  }
  return keys;
}

function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
}

function movementMonthKey(dateVal) {
  if (!dateVal) return '';
  const s = typeof dateVal === 'string' ? dateVal : new Date(dateVal).toISOString();
  return s.slice(0, 7);
}

function jobExpensesTotal(j) {
  return (
    Number(j.expense_shipping || 0) +
    Number(j.expense_repuestos || 0) +
    Number(j.expense_terciarizacion || 0)
  );
}

function roundMoney(n) {
  return Number(Number(n).toFixed(2));
}

function aggregatePaidJobsAndMovements(paidJobs, movements) {
  const ingresos = paidJobs.reduce((s, j) => s + Number(j.amount || 0), 0);
  const gastosTrabajos = paidJobs.reduce((s, j) => s + jobExpensesTotal(j), 0);
  const gastosGenerales = (movements || [])
    .filter((m) => m.type === 'EXPENSE')
    .reduce((s, m) => s + Number(m.amount || 0), 0);
  const otrosIngresos = (movements || [])
    .filter((m) => m.type === 'INCOME')
    .reduce((s, m) => s + Number(m.amount || 0), 0);
  const gastosPorCategoria = (movements || [])
    .filter((m) => m.type === 'EXPENSE')
    .reduce((acc, m) => {
      const cat = m.category || 'Otros';
      acc[cat] = (acc[cat] || 0) + Number(m.amount || 0);
      return acc;
    }, {});
  const balance = ingresos + otrosIngresos - gastosTrabajos - gastosGenerales;
  return {
    ingresos: roundMoney(ingresos),
    otrosIngresos: roundMoney(otrosIngresos),
    gastosTrabajos: roundMoney(gastosTrabajos),
    gastosGenerales: roundMoney(gastosGenerales),
    gastosPorCategoria,
    balance: roundMoney(balance),
  };
}

function buildMonthlyRows(paidJobs, movements, monthKeys) {
  const empty = () => ({
    ingresos: 0,
    otrosIngresos: 0,
    gastosTrabajos: 0,
    gastosGenerales: 0,
  });
  const byMonth = Object.fromEntries(monthKeys.map((k) => [k, empty()]));

  for (const j of paidJobs) {
    const pk = (j.paid_at || '').slice(0, 7);
    if (!byMonth[pk]) continue;
    byMonth[pk].ingresos += Number(j.amount || 0);
    byMonth[pk].gastosTrabajos += jobExpensesTotal(j);
  }
  for (const m of movements || []) {
    const dk = movementMonthKey(m.date);
    if (!byMonth[dk]) continue;
    if (m.type === 'EXPENSE') byMonth[dk].gastosGenerales += Number(m.amount || 0);
    if (m.type === 'INCOME') byMonth[dk].otrosIngresos += Number(m.amount || 0);
  }

  return monthKeys.map((ym) => {
    const row = byMonth[ym];
    const balance = roundMoney(
      row.ingresos + row.otrosIngresos - row.gastosTrabajos - row.gastosGenerales
    );
    return {
      month: ym,
      label: monthLabel(ym),
      ingresos: roundMoney(row.ingresos),
      otrosIngresos: roundMoney(row.otrosIngresos),
      gastosTrabajos: roundMoney(row.gastosTrabajos),
      gastosGenerales: roundMoney(row.gastosGenerales),
      balance,
    };
  });
}

export async function getBalanceSummary(filters = {}) {
  const fromDate = filters.fromDate || null;
  const toDate = filters.toDate || null;

  if (!fromDate || !toDate) {
    const { data: jobs, error: jobsErr } = await supabase
      .from('jobs')
      .select('amount, billing_status, expense_shipping, expense_repuestos, expense_terciarizacion, paid_at');
    if (jobsErr) throw new Error(jobsErr.message);

    const { data: movements, error: movErr } = await supabase
      .from('cash_movements')
      .select('type, category, amount, date');
    if (movErr) throw new Error(movErr.message);

    const paidJobs = (jobs || []).filter((j) => j.billing_status === 'PAID');
    const ingresos = paidJobs.reduce((s, j) => s + Number(j.amount || 0), 0);
    const gastosTrabajos = (jobs || []).reduce((s, j) => s + jobExpensesTotal(j), 0);
    const gastosGenerales = (movements || [])
      .filter((m) => m.type === 'EXPENSE')
      .reduce((s, m) => s + Number(m.amount || 0), 0);
    const otrosIngresos = (movements || [])
      .filter((m) => m.type === 'INCOME')
      .reduce((s, m) => s + Number(m.amount || 0), 0);
    const gastosPorCategoria = (movements || [])
      .filter((m) => m.type === 'EXPENSE')
      .reduce((acc, m) => {
        const cat = m.category || 'Otros';
        acc[cat] = (acc[cat] || 0) + Number(m.amount || 0);
        return acc;
      }, {});
    const balance = ingresos + otrosIngresos - gastosTrabajos - gastosGenerales;

    return {
      ingresos: roundMoney(ingresos),
      otrosIngresos: roundMoney(otrosIngresos),
      gastosTrabajos: roundMoney(gastosTrabajos),
      gastosGenerales: roundMoney(gastosGenerales),
      gastosPorCategoria,
      balance: roundMoney(balance),
      monthly: [],
      previousPeriod: null,
      comparison: null,
      range: null,
    };
  }

  const toEnd = `${toDate}T23:59:59.999Z`;

  let jobsQuery = supabase
    .from('jobs')
    .select('amount, billing_status, expense_shipping, expense_repuestos, expense_terciarizacion, paid_at')
    .eq('billing_status', 'PAID')
    .gte('paid_at', fromDate)
    .lte('paid_at', toDate);

  const { data: paidJobs, error: jobsErr } = await jobsQuery;
  if (jobsErr) throw new Error(jobsErr.message);

  let movQuery = supabase
    .from('cash_movements')
    .select('type, category, amount, date')
    .gte('date', fromDate)
    .lte('date', toEnd);

  const { data: movements, error: movErr } = await movQuery;
  if (movErr) throw new Error(movErr.message);

  const summary = aggregatePaidJobsAndMovements(paidJobs || [], movements || []);
  const monthKeys = monthKeysInRange(fromDate, toDate);
  const monthly = buildMonthlyRows(paidJobs || [], movements || [], monthKeys);

  const prev = previousPeriod(fromDate, toDate);
  const prevToEnd = `${prev.toDate}T23:59:59.999Z`;

  const { data: prevPaidJobs, error: prevJobsErr } = await supabase
    .from('jobs')
    .select('amount, billing_status, expense_shipping, expense_repuestos, expense_terciarizacion, paid_at')
    .eq('billing_status', 'PAID')
    .gte('paid_at', prev.fromDate)
    .lte('paid_at', prev.toDate);

  if (prevJobsErr) throw new Error(prevJobsErr.message);

  const { data: prevMovements, error: prevMovErr } = await supabase
    .from('cash_movements')
    .select('type, category, amount, date')
    .gte('date', prev.fromDate)
    .lte('date', prevToEnd);

  if (prevMovErr) throw new Error(prevMovErr.message);

  const prevSummary = aggregatePaidJobsAndMovements(prevPaidJobs || [], prevMovements || []);

  const pct = (cur, prevVal) => {
    if (prevVal === 0 || prevVal === null || prevVal === undefined) return null;
    return roundMoney(((cur - prevVal) / Math.abs(prevVal)) * 100);
  };

  const comparison = {
    balanceDelta: roundMoney(summary.balance - prevSummary.balance),
    balancePct: pct(summary.balance, prevSummary.balance),
    ingresosDelta: roundMoney(summary.ingresos - prevSummary.ingresos),
    ingresosPct: pct(summary.ingresos, prevSummary.ingresos),
  };

  return {
    ...summary,
    monthly,
    previousPeriod: {
      fromDate: prev.fromDate,
      toDate: prev.toDate,
      ...prevSummary,
    },
    comparison,
    range: { fromDate, toDate },
  };
}

// --- Equipment interventions (inventario taller/campo) ---
export async function getEquipmentInterventions() {
  const { data, error } = await supabase
    .from('equipment_interventions')
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    ...mapKeys(row),
    client: row.client ? { id: row.client.id, businessName: row.client.business_name } : null,
  }));
}

export async function createEquipmentIntervention(payload) {
  const { data, error } = await supabase
    .from('equipment_interventions')
    .insert({
      client_id: payload.clientId || null,
      location: payload.location || 'TALLER',
      equipment_name: payload.equipmentName,
      brand: payload.brand || null,
      model: payload.model || null,
      serial_number: payload.serialNumber || null,
      intake_date: payload.intakeDate || null,
      diagnosis: payload.diagnosis || null,
      technical_action: payload.technicalAction || null,
      updated_at: new Date().toISOString(),
    })
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .single();

  if (error) throw new Error(error.message);
  return {
    ...mapKeys(data),
    client: data.client ? { id: data.client.id, businessName: data.client.business_name } : null,
  };
}

export async function updateEquipmentIntervention(id, updates) {
  const payload = { updated_at: new Date().toISOString() };
  if (updates.clientId !== undefined) payload.client_id = updates.clientId || null;
  if (updates.location !== undefined) payload.location = updates.location || 'TALLER';
  if (updates.equipmentName !== undefined) payload.equipment_name = updates.equipmentName;
  if (updates.brand !== undefined) payload.brand = updates.brand || null;
  if (updates.model !== undefined) payload.model = updates.model || null;
  if (updates.serialNumber !== undefined) payload.serial_number = updates.serialNumber || null;
  if (updates.intakeDate !== undefined) payload.intake_date = updates.intakeDate || null;
  if (updates.diagnosis !== undefined) payload.diagnosis = updates.diagnosis || null;
  if (updates.technicalAction !== undefined) payload.technical_action = updates.technicalAction || null;

  const { data, error } = await supabase
    .from('equipment_interventions')
    .update(payload)
    .eq('id', id)
    .select(`
      *,
      client:clients(id, business_name)
    `)
    .single();

  if (error) throw new Error(error.message);
  return {
    ...mapKeys(data),
    client: data.client ? { id: data.client.id, businessName: data.client.business_name } : null,
  };
}

export async function deleteEquipmentIntervention(id) {
  const { error } = await supabase.from('equipment_interventions').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
