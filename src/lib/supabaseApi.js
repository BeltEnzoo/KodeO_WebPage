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
  const { data: row, error } = await supabase
    .from('jobs')
    .insert({
      client_id: data.clientId,
      title: data.title,
      description: data.description || null,
      work_status: data.workStatus ?? 'PENDING',
      billing_status: data.billingStatus ?? 'NOT_INVOICED',
      amount: data.amount != null && data.amount !== '' ? Number(data.amount) : null,
      expense_shipping: Number(data.expenseShipping ?? 0) || 0,
      expense_repuestos: Number(data.expenseRepuestos ?? 0) || 0,
      expense_terciarizacion: Number(data.expenseTerciarizacion ?? 0) || 0,
    })
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

// --- Balance (resumen financiero) ---
export async function getBalanceSummary(filters = {}) {
  const fromDate = filters.fromDate || null;
  const toDate = filters.toDate || null;

  let jobsQuery = supabase.from('jobs').select('amount, billing_status, expense_shipping, expense_repuestos, expense_terciarizacion');
  if (fromDate) jobsQuery = jobsQuery.gte('created_at', fromDate);
  if (toDate) jobsQuery = jobsQuery.lte('created_at', toDate + 'T23:59:59.999Z');

  const { data: jobs, error: jobsErr } = await jobsQuery;
  if (jobsErr) throw new Error(jobsErr.message);

  let movQuery = supabase
    .from('cash_movements')
    .select('type, category, amount');
  if (fromDate) movQuery = movQuery.gte('date', fromDate);
  if (toDate) movQuery = movQuery.lte('date', toDate + 'T23:59:59.999Z');

  const { data: movements, error: movErr } = await movQuery;
  if (movErr) throw new Error(movErr.message);

  const paidJobs = (jobs || []).filter((j) => j.billing_status === 'PAID');
  const ingresos = paidJobs.reduce((s, j) => s + Number(j.amount || 0), 0);
  const gastosTrabajos = (jobs || []).reduce(
    (s, j) =>
      s +
      Number(j.expense_shipping || 0) +
      Number(j.expense_repuestos || 0) +
      Number(j.expense_terciarizacion || 0),
    0
  );

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

  return {
    ingresos: Number(ingresos.toFixed(2)),
    otrosIngresos: Number(otrosIngresos.toFixed(2)),
    gastosTrabajos: Number(gastosTrabajos.toFixed(2)),
    gastosGenerales: Number(gastosGenerales.toFixed(2)),
    gastosPorCategoria,
    balance: Number((ingresos + otrosIngresos - gastosTrabajos - gastosGenerales).toFixed(2)),
  };
}
