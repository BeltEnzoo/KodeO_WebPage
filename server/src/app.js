import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../dist');
const indexPath = path.join(distPath, 'index.html');
const hasFrontendBuild = fs.existsSync(indexPath);

if (hasFrontendBuild) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    return res.sendFile(indexPath);
  });
}

export { app };
