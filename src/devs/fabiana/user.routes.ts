import { Router } from 'express';
import {
    actualizarPerfil,
    loginUsuario,
    obtenerPerfil,
    registrarUsuario
} from './user.controller';

const router = Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/:id', obtenerPerfil);
router.put('/:id', actualizarPerfil);

export default router;
