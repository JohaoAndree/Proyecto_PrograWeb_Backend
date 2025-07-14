import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

// Importaciones de rutas de cada dev
import diegoRoutes from './devs/diego/game.routes';
import fabianaRoutes from './devs/fabiana/game.routes';
import gersonRoutes from './devs/gerson/game.routes';
import johaoRoutes from './devs/johao/game.routes';
import patrickRoutes from './devs/patrick/game.routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas públicas para imágenes
app.use('/imagenes', express.static(path.join(__dirname, '../public/imagenes')));

// ENDPOINTS DE DESARROLLADORES
app.use('/api/diego/games', diegoRoutes);
app.use('/api/fabiana/games', fabianaRoutes);
app.use('/api/gerson/games', gersonRoutes);
app.use('/api/johao', johaoRoutes);
app.use('/api/patrick/games', patrickRoutes);

export default app;