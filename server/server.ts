import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import busRoutes from './routes/busRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import paymentRoutes from './routes/payment.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ✅ Test Routes (No DB required)
app.get('/', (_req, res) => {
  res.json({ message: 'API is running...', status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('GLOBAL ERROR:', err?.stack || err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err?.message || 'Unknown error'
  });
});

async function bootstrap() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 SmartBus API Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('❌ Server bootstrap failed:', error.message);
  } else {
    console.error('❌ Server bootstrap failed with unknown error');
  }
  process.exit(1);
});
