import { Router } from 'express';
import { getAllGames } from './game.controller';

const router = Router();

router.get('/', getAllGames);

export default router;