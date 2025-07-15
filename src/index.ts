import app from './app';
import { env } from './config/env';
import express from 'express';
import gersonRoutes from './devs/gerson/game.routes';

// Sirve los archivos de la carpeta public/
app.use(express.static("public"));

// Activa las rutas del dev Gerson
app.use("/devs", gersonRoutes);

app.listen(env.PORT, () => {
  console.log(`El servidor se ha iniciado en el puerto: ${env.PORT}`);
});
