import { Router } from 'express';
import {
    actualizarPerfil,
    eliminarDelCarrito,
    loginUsuario,
    obtenerPerfil,
    registrarUsuario
} from './user.controller';

const router = Router();

router.post('/users/register', registrarUsuario);
router.post('/users/login', loginUsuario);
router.get('/users/:id', obtenerPerfil);
router.put('/users/:id', actualizarPerfil);
router.delete('/carrito/:id', eliminarDelCarrito);

export default router;
