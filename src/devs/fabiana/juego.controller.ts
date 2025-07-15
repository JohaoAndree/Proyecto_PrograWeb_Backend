import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const obtenerJuegos = async (_req: Request, res: Response) => {
  const juegos = await prisma.juego.findMany({
  where: { estado: true },
  include: { categoria: true },
});

  res.json(juegos);
};

export const agregarJuego = async (req: Request, res: Response) => {
  const { nombre, precio, descripcion, categoriaId, descuento, foto, imagen } = req.body;

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
        imagen,
        estaOferta: false,
        estado: true,
        categoria: {
          connect: { id: categoriaIdNumber },
        },
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
  const {
    nombre,
    precio,
    descripcion,
    categoriaId,
    descuento,
    foto,
    estado,
  } = req.body;

  try {
    const data: any = {};

    if (nombre !== undefined) data.nombre = nombre;
    if (precio !== undefined) data.precio = parseFloat(precio);
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (descuento !== undefined) data.descuento = descuento;
    if (foto !== undefined) data.foto = foto;
    if (estado !== undefined) data.estado = estado;
    if (categoriaId !== undefined) {
      data.categoria = {
        connect: { id: Number(categoriaId) },
      };
    }

    const actualizado = await prisma.juego.update({
      where: { id },
      data,
    });

    res.json(actualizado);
  } catch (error) {
    console.error('Error al editar juego:', error);
    res.status(500).json({ mensaje: 'Error al editar juego' });
  }
};

export const eliminarJuego = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.juego.update({
  where: { id },
  data: { estado: false },
});
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

export const eliminarLogicamenteJuego = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const actualizado = await prisma.juego.update({
      where: { id },
      data: {
        estado: false,
      },
    });

    res.json({ mensaje: 'Juego eliminado lógicamente', juego: actualizado });
  } catch (error) {
    console.error('Error en eliminación lógica:', error);
    res.status(500).json({ mensaje: 'Error al eliminar juego lógicamente' });
  }
};
