import { Router } from 'express';
import { registrarUsuario, obtenerListaJuegos, agregarAlCarrito, obtenerCarrito, getAllGames } from './game.controller';
import cors from "cors";

const router = Router();

//req2
router.post("/registro", registrarUsuario)

//req9
router.get("/juegos", obtenerListaJuegos)

//req10
router.post("carrito/agregar", agregarAlCarrito)
router.get("carrito/:userID", obtenerCarrito)

router.get('/', getAllGames);

export default router;