import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const eliminarDelCarrito = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId);
  const juegoId = Number(req.params.juegoId);

  try {
    await prisma.carrito.delete({
      where: {
        usuarioId_juegoId: {
          usuarioId,
          juegoId,
        },
      },
    });

    res.status(200).json({ mensaje: 'Juego eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ mensaje: 'No se pudo eliminar el juego del carrito' });
  }
};

