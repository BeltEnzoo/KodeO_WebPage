import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { authRouter } from './modules/auth/auth.routes.js';
import { clientUsersRouter } from './modules/client-users/client-users.routes.js';
import { clientsRouter } from './modules/clients/clients.routes.js';
import { jobsRouter } from './modules/jobs/jobs.routes.js';
import { quotesRouter } from './modules/quotes/quotes.routes.js';

const app = express();
const configuredOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isConfiguredOrigin = configuredOrigins.includes(origin);
      const isLocalhostDev = /^https?:\/\/localhost:\d+$/.test(origin);

      if (isConfiguredOrigin || isLocalhostDev) {
        return callback(null, true);
      }

      return callback(new Error('CORS origin blocked'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kodeon-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/client-users', clientUsersRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/quotes', quotesRouter);

export { app };
