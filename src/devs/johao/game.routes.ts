import { Router } from 'express';
import {
  getAllUsuarios,
  countUsuarios,
  getAllNoticias,
  createNoticia,
  updateNoticia,
  deleteNoticia,
  getGanancias,
  getAdminProfile,
  countVentas,
} from './game.controller';
import { upload } from '../../middlewares/upload';

const router = Router();

// Rutas de usuarios
router.get('/usuarios', getAllUsuarios);
router.get('/usuarios/count', countUsuarios);
router.get('/usuarios/admin', getAdminProfile);

// Rutas de noticias
router.get('/noticias', getAllNoticias);
router.post('/noticias', upload.single('foto'), createNoticia);
router.put('/noticias/:id', upload.single('foto'), updateNoticia);
router.delete('/noticias/:id', deleteNoticia);

// Rutas de ventas
router.get('/ventas/ganancias', getGanancias);
router.get('/ventas/count', countVentas);

export default router;