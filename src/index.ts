import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './prisma';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import serviceRoutes from './routes/service.routes';
import messageRoutes from './routes/message.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Use centralized prisma instance
export { prisma };

// Enable trust proxy - penting untuk express-rate-limit saat menggunakan proxy/ngrok
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  // Konfigurasi khusus untuk Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact-info', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404s
app.use(notFoundHandler);

// Start the server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
