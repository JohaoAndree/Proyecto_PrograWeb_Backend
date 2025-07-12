import { Request, Response } from 'express';

export const getAllGames = (_req: Request, res: Response) => {
  res.json({ mensaje: 'Listado de juegos desde la ruta de [NOMBRE]' });
};