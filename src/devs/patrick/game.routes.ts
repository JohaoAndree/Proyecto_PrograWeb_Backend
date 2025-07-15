import { Router } from 'express';
// import { getAllGames } from './game.controller'; 
import { recuperar, nuevaClave } from './game.controller'; // Asegúrate que exista



const router = Router();

router.post('/recuperar', recuperar); //  Ruta usada por el frontend
router.post('/reset-password/:token', nuevaClave);


export default router;