import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const jobsRouter = Router();

const createJobSchema = z.object({
  clientId: z.string().min(1, 'Debe seleccionar un cliente.'),
  title: z.string().min(2, 'Titulo invalido.'),
  description: z.string().trim().optional(),
  workStatus: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
  billingStatus: z.enum(['NOT_INVOICED', 'INVOICED', 'PAID']).optional(),
  amount: z.coerce.number().nonnegative().optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
});

const updateJobSchema = createJobSchema.partial().omit({ clientId: true });

jobsRouter.get('/', requireAuth, requireRole('ADMIN'), async (_req, res) => {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { id: true, businessName: true } } },
  });

  return res.json({ jobs });
});

jobsRouter.post('/', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const parsed = createJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' });
  }

  try {
    const job = await prisma.job.create({
      data: {
        clientId: parsed.data.clientId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        workStatus: parsed.data.workStatus ?? 'PENDING',
        billingStatus: parsed.data.billingStatus ?? 'NOT_INVOICED',
        amount: Number.isFinite(parsed.data.amount) ? parsed.data.amount : null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
      include: { client: { select: { id: true, businessName: true } } },
    });

    return res.status(201).json({ job });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cliente invalido.' });
    }
    return res.status(500).json({ error: 'No se pudo crear el trabajo.' });
  }
});

jobsRouter.patch('/:jobId', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const parsed = updateJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' });
  }

  try {
    const job = await prisma.job.update({
      where: { id: req.params.jobId },
      data: {
        ...parsed.data,
        description: parsed.data.description === '' ? null : parsed.data.description,
        amount: parsed.data.amount === '' || parsed.data.amount === undefined ? undefined : parsed.data.amount,
        startDate: parsed.data.startDate === '' ? null : parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
        endDate: parsed.data.endDate === '' ? null : parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      },
      include: { client: { select: { id: true, businessName: true } } },
    });

    return res.json({ job });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Trabajo no encontrado.' });
    }
    return res.status(500).json({ error: 'No se pudo actualizar el trabajo.' });
  }
});

jobsRouter.get('/me', requireAuth, requireRole('CLIENT'), async (req, res) => {
  if (!req.user.clientId) {
    return res.status(400).json({ error: 'Cliente no asociado al usuario.' });
  }

  const jobs = await prisma.job.findMany({
    where: { clientId: req.user.clientId },
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { businessName: true } } },
  });

  return res.json({ jobs });
});

export { jobsRouter };
