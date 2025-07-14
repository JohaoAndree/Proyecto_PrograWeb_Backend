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
import { upload } from '../../middlewares/upload';

const router = Router();

// Rutas de usuarios
router.get('/usuarios', getAllUsuarios);
router.get('/usuarios/count', countUsuarios);

// Rutas de noticias
router.get('/noticias', getAllNoticias);
router.post('/noticias', upload.single('foto'), createNoticia);
router.put('/noticias/:id', upload.single('foto'), updateNoticia);
router.delete('/noticias/:id', deleteNoticia);

// Rutas de ventas
router.get('/ventas/ganancias', getGanancias);

export default router;