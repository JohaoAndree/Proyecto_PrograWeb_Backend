import { Router } from 'express';
import {
  getAllUsuarios,
  countUsuarios,
  getAllNoticias,
  createNoticia,
  updateNoticia,
  deleteNoticia,
  getGanancias,
} from './game.controller';

const router = Router();

// Rutas de usuarios
router.get('/usuarios', getAllUsuarios);
router.get('/usuarios/count', countUsuarios);

// Rutas de noticias
router.get('/noticias', getAllNoticias);
router.post('/noticias', createNoticia);
router.put('/noticias/:id', updateNoticia);
router.delete('/noticias/:id', deleteNoticia);

// Rutas de ventas
router.get('/ventas/ganancias', getGanancias);

export default router;