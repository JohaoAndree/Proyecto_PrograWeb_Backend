import { Router } from 'express';
// import { getAllGames } from './game.controller'; 
import { recuperar } from './game.controller'; // Asegúrate que exista

const router = Router();

router.post('/recuperar', recuperar); // 👈 Ruta usada por el frontend

export default router;