import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const clientsRouter = Router();

const createClientSchema = z.object({
  businessName: z.string().min(2, 'Razon social invalida.'),
  cuit: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().email('Email invalido.').optional().or(z.literal('')),
  notes: z.string().trim().optional(),
});

const updateClientSchema = createClientSchema.partial();

clientsRouter.use(requireAuth, requireRole('ADMIN'));

clientsRouter.get('/', async (_req, res) => {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, email: true, active: true } },
      _count: { select: { jobs: true, quotes: true, deliveryNotes: true } },
    },
  });

  return res.json({ clients });
});

clientsRouter.post('/', async (req, res) => {
  const parsed = createClientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' });
  }

  const normalizedData = {
    ...parsed.data,
    cuit: parsed.data.cuit || null,
    address: parsed.data.address || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    notes: parsed.data.notes || null,
  };

  try {
    const client = await prisma.client.create({ data: normalizedData });
    return res.status(201).json({ client });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un cliente con ese CUIT.' });
    }
    return res.status(500).json({ error: 'No se pudo crear el cliente.' });
  }
});

clientsRouter.patch('/:clientId', async (req, res) => {
  const parsed = updateClientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' });
  }

  try {
    const client = await prisma.client.update({
      where: { id: req.params.clientId },
      data: {
        ...parsed.data,
        cuit: parsed.data.cuit === '' ? null : parsed.data.cuit,
        address: parsed.data.address === '' ? null : parsed.data.address,
        phone: parsed.data.phone === '' ? null : parsed.data.phone,
        email: parsed.data.email === '' ? null : parsed.data.email,
        notes: parsed.data.notes === '' ? null : parsed.data.notes,
      },
    });
    return res.json({ client });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un cliente con ese CUIT.' });
    }
    return res.status(500).json({ error: 'No se pudo actualizar el cliente.' });
  }
});

export { clientsRouter };
