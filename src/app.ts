import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

// Importaciones de rutas de cada dev
import diegoRoutes from './devs/diego/game.routes';
import fabianaRoutes from './devs/fabiana/game.routes';
import juegoRoutes from './devs/fabiana/juego.router';
import fabianaUserRoutes from './devs/fabiana/user.routes';
import gersonRoutes from './devs/gerson/game.routes';
import johaoRoutes from './devs/johao/game.routes';
import patrickRoutes from './devs/patrick/game.routes';

const app = express();

app.use(cors());
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
app.use('/api/fabiana/users', fabianaUserRoutes);
app.use('/api', fabianaUserRoutes);
app.use("/api/juegos", juegoRoutes);

export default app;