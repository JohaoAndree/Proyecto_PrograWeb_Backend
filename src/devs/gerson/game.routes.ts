// src/devs/gerson/game.routes.ts
import { Router } from 'express';
import { registrarUsuario, obtenerJuegosMasVendidos, obtenerJuegosPopulares, uploadUserPhoto } from './game.controller';
import cors from "cors";

const router = Router();

// === REQ3 ===
router.post('/registro', uploadUserPhoto.single('foto'), registrarUsuario);

// === REQ7 ===
router.get('/masvendidos', obtenerJuegosMasVendidos);

// === REQ8 ===
router.get("/juegos-populares", obtenerJuegosPopulares);

export default router;