import { Router } from 'express';
import { eliminarDelCarrito } from './carrito.controller';


const router = Router();

// DELETE /api/carrito/:id
router.delete('/:id', eliminarDelCarrito);

export default router;
