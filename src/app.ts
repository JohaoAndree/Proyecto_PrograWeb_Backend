import cors from 'cors';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import path from 'path';

// Importaciones de rutas de cada dev
import diegoRoutes from './devs/diego/game.routes';
import carritoRoutes from './devs/fabiana/carrito.router';
import fabianaRoutes from './devs/fabiana/game.routes';
import fabianaUserRoutes from './devs/fabiana/user.routes';


import juegoRoutes from './devs/fabiana/juego.router';
import gersonRoutes from './devs/gerson/game.routes';
import johaoRoutes from './devs/johao/game.routes';
import patrickRoutes from './devs/patrick/game.routes';



const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//Endpoint de prueba con ruta raíz
app.get('/', (req : Request, resp : Response) => {
    resp.send('¡Hola, mundo!');
});

//Endpoint de prueba con ruta definida
app.get('/definida', (req : Request, resp : Response) => {
    resp.send('¡Hola, mundo desde la ruta definida!');
});

//Endpoint de prueba que recibe data por path parameters
app.get('/path/:nombre/:apellido', (req : Request, resp : Response) => {
    const nombre = req.params.nombre;
    const apellido = req.params.apellido;
    resp.send(`¡Hola, ${nombre} ${apellido}!`);
});

//Endpoint de prueba que recibe data por query parameters
app.get('/query', (req : Request, resp : Response) => {
    const nombre = req.query.nombre;
    const apellido = req.query.apellido;
    resp.send(`¡Hola, ${nombre} ${apellido}!`);
});

// Rutas públicas para imágenes
app.use('/imagenes', express.static(path.join(__dirname, '../../public/imagenes')));

// ENDPOINTS DE DESARROLLADORES
app.use('/api/diego/games', diegoRoutes);
app.use('/api/fabiana/games', fabianaRoutes);
app.use('/api/gerson/games', gersonRoutes);
app.use('/api', johaoRoutes);
app.use('/api/patrick/games', patrickRoutes);
app.use('/api/fabiana/users', fabianaUserRoutes);
app.use('/api', fabianaUserRoutes);
app.use('/api/carrito', carritoRoutes);
app.use("/api/juegos", juegoRoutes);


// Inicia el servidor
app.listen(5020, () => {
  console.log('Servidor corriendo en http://localhost:5020');
});

export default app;