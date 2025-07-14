// src/devs/fabiana/juego.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();


export const obtenerJuegos = async (_req: Request, res: Response) => {
  const juegos = await prisma.juego.findMany({
    include: { categoria: true },
  });
  res.json(juegos);
};

export const agregarJuego = async (req: Request, res: Response) => {
  const { nombre, precio, descripcion, categoriaId, descuento, foto } = req.body;

  // Asegúrate de convertir categoriaId a número
  const categoriaIdNumber = Number(categoriaId); // Definir correctamente

  try {
    console.log("📦 Datos recibidos en el backend:", {
      nombre,
      precio,
      descripcion,
      categoriaId,
      descuento,
      foto
    });

    const nuevo = await prisma.juego.create({
      data: {
        nombre,
        precio: parseFloat(precio),
        descripcion,
        descuento,
        foto,
        estaOferta: false,
        estado: true,
        categoria: { connect: { id: categoriaIdNumber } }, // Usa categoriaIdNumber aquí
      },
    });

    res.json(nuevo);
  } catch (error) {
    console.error("Error al agregar juego:", error);
    res.status(500).json({ mensaje: 'Error al agregar juego' });
  }
};






export const editarJuego = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nombre, precio, descripcion, categoriaId, descuento, foto } = req.body;

  try {
    const actualizado = await prisma.juego.update({
      where: { id },
      data: {
        nombre,
        precio: parseFloat(precio),
        descripcion,
        descuento,
        foto,
        categoria: {
          connect: {
            id: Number(categoriaId),
          },
        },
      },
    });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al editar juego' });
  }
};


export const eliminarJuego = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.juego.delete({ where: { id } });
    res.json({ mensaje: 'Juego eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar juego' });
  }
};

export const obtenerCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
};
