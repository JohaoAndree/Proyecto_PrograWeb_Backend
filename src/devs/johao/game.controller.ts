import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';


const prisma = new PrismaClient();

// Obtener todos los usuarios
export const getAllUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener cantidad total de usuarios
export const countUsuarios = async (_req: Request, res: Response) => {
  try {
    const count = await prisma.usuario.count();
    res.json({ totalUsuarios: count });
  } catch (error) {
    res.status(500).json({ error: 'Error al contar usuarios' });
  }
};

// Obtener todas las noticias
export const getAllNoticias = async (_req: Request, res: Response) => {
  try {
    const noticias = await prisma.noticia.findMany();
    res.json(noticias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

// Crear una nueva noticia
export const createNoticia = async (req: Request, res: Response) => {
  try {
    const { titulo, texto, foto, activo } = req.body;
    const nuevaNoticia = await prisma.noticia.create({
      data: { titulo, texto, foto, activo },
    });
    res.status(201).json(nuevaNoticia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la noticia' });
  }
};

// Actualizar una noticia por ID
export const updateNoticia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, texto, foto, activo } = req.body;

  try {
    const noticiaActualizada = await prisma.noticia.update({
      where: { id: Number(id) },
      data: { titulo, texto, foto, activo },
    });
    res.json(noticiaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la noticia' });
  }
};

// Eliminar una noticia por ID
export const deleteNoticia = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.noticia.delete({
      where: { id: Number(id) },
    });
    res.json({ mensaje: 'Noticia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la noticia' });
  }
};

// Obtener ganancias por ventas
export const getGanancias = async (_req: Request, res: Response) => {
  try {
    const ventas = await prisma.venta.findMany();
    const total = ventas.reduce((acc: number, venta: { montoPagado: number }) => acc + venta.montoPagado, 0);
    res.json({ gananciasTotales: total });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular ganancias' });
  }
};
