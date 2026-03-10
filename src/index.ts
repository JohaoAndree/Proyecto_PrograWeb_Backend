import app from './app';
import { env } from './config/env';
import express from 'express';

// Sirve los archivos de la carpeta public/
app.use(express.static("public"));

app.listen(env.PORT, () => {
  console.log(`El servidor se ha iniciado en el puerto: ${env.PORT}`);
});
