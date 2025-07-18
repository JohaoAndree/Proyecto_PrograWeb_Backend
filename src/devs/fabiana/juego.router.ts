import { Router } from 'express';
import {
    agregarJuego,
    editarJuego,
    eliminarJuego,
    eliminarLogicamenteJuego,
    obtenerCategorias,
    obtenerJuegos,
} from './juego.controller';



const router = Router();

router.get('/', obtenerJuegos);             // GET /api/juegos
router.post('/', agregarJuego);            // POST /api/juegos
router.put('/:id', editarJuego);           // PUT /api/juegos/:id
router.delete('/:id', eliminarJuego);      // DELETE /api/juegos/:id
router.get('/categorias', obtenerCategorias);

router.put('/eliminar/:id', eliminarLogicamenteJuego); // ✅ Nueva ruta


export default router;
