import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';

// Importaciones de rutas de cada dev
import diegoRoutes from './devs/diego/game.routes';
import fabianaRoutes from './devs/fabiana/game.routes';
import juegoRoutes from './devs/fabiana/juego.router';
import fabianaUserRoutes from './devs/fabiana/user.routes';
import gersonRoutes from './devs/gerson/game.routes';
import johaoRoutes from './devs/johao/game.routes';
import patrickRoutes from './devs/patrick/game.routes';

const app = express();

// CORS restringido: solo el frontend puede hacer peticiones
const allowedOrigins = [
  env.FRONTEND_URL?.toLowerCase().replace(/\/$/, ""),
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);

    // Normalizar origin de la petición (quitar slash final y pasar a minúsculas)
    const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origen denegado: ${origin}`);
      callback(new Error('Origen no permitido por CORS'));
    }
  },
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas públicas para imágenes
app.use('/imagenes', express.static(path.join(__dirname, '../public/imagenes')));

// ENDPOINTS DE DESARROLLADORES
app.use('/api/diego/games', diegoRoutes);
app.use('/api/fabiana/games', fabianaRoutes);
app.use('/api/gerson/games', gersonRoutes);
app.use('/api/johao', johaoRoutes);
app.use('/api/patrick/games', patrickRoutes);
app.use('/api/users', fabianaUserRoutes);
app.use("/api/juegos", juegoRoutes);

// Error handler global — atrapa errores de controllers, multer, etc.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${new Date().toISOString()}]`, err.message);

  // Errores de multer (archivo muy grande, tipo no permitido)
  if (err.message.includes('Solo se permiten') || err.message.includes('File too large')) {
    res.status(400).json({ error: err.message });
    return;
  }

  // En desarrollo mostrar detalle, en producción solo mensaje genérico
  if (env.NODE_ENV === 'development') {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default app;