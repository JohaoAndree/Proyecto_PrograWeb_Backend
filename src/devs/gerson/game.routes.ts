// src/devs/gerson/game.routes.ts
import { Router } from 'express';
import { registrarUsuario, obtenerJuegosMasVendidos, obtenerJuegosPopulares, } from './game.controller';
import cors from "cors";

const router = Router();

// === REQ3 ===
router.post('/registro', registrarUsuario);

// === REQ7 ===
router.get('/masvendidos', obtenerJuegosMasVendidos);

// === REQ8 ===
router.get("/gerson/juegos-populares", cors(), obtenerJuegosPopulares);

export default router;