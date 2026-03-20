import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const clientUsersRouter = Router();

const createClientUserSchema = z.object({
  name: z.string().min(2, 'Nombre invalido.'),
  email: z.string().email('Email invalido.'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.'),
  clientId: z.string().min(1, 'Debe seleccionar un cliente.'),
});

clientUsersRouter.use(requireAuth, requireRole('ADMIN'));

clientUsersRouter.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      active: true,
      createdAt: true,
      client: { select: { id: true, businessName: true } },
    },
  });

  return res.json({ users });
});

clientUsersRouter.post('/', async (req, res) => {
  const parsed = createClientUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' });
  }

  const existingClientUser = await prisma.user.findFirst({
    where: { role: 'CLIENT', clientId: parsed.data.clientId },
    select: { id: true },
  });

  if (existingClientUser) {
    return res.status(409).json({ error: 'Este cliente ya tiene un usuario asociado.' });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: 'CLIENT',
        clientId: parsed.data.clientId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        client: { select: { id: true, businessName: true } },
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un usuario con ese email.' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cliente invalido.' });
    }
    return res.status(500).json({ error: 'No se pudo crear el usuario cliente.' });
  }
});

export { clientUsersRouter };
