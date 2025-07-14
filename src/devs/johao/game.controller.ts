import { Request, Response } from 'express';
import { PrismaClient, Noticia} from '../../generated/prisma';
import { subMonths, startOfMonth, format, isAfter } from 'date-fns';

const prisma = new PrismaClient();

// Obtener todos los usuarios
export const getAllUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
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
    const noticias = await prisma.noticia.findMany({
      where: { activo: true },
    });

    const noticiasMapeadas = noticias.map((noticia: Noticia) => ({
      id: noticia.id,
      foto: noticia.foto,
      nombre: noticia.titulo,
      descripcion: noticia.texto,
    }));

    res.json(noticiasMapeadas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

// Crear una nueva noticia
export const createNoticia = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, foto } = req.body;

    const nuevaNoticia = await prisma.noticia.create({
      data: {
        titulo: nombre,
        texto: descripcion,
        foto,
        activo: true, // activa por defecto
      },
    });

    res.status(201).json({
      id: nuevaNoticia.id,
      foto: nuevaNoticia.foto,
      nombre: nuevaNoticia.titulo,
      descripcion: nuevaNoticia.texto,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la noticia' });
  }
};

// Actualizar una noticia por ID
export const updateNoticia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, foto } = req.body;

  try {
    const noticiaActualizada = await prisma.noticia.update({
      where: { id: Number(id) },
      data: {
        titulo: nombre,
        texto: descripcion,
        foto,
      },
    });

    res.json({
      id: noticiaActualizada.id,
      foto: noticiaActualizada.foto,
      nombre: noticiaActualizada.titulo,
      descripcion: noticiaActualizada.texto,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la noticia' });
  }
};

// Eliminar una noticia por ID
export const deleteNoticia = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.noticia.update({
      where: { id: Number(id) },
      data: { activo: false },
    });

    res.json({ mensaje: 'Noticia desactivada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar la noticia' });
  }
};

// Obtener ganancias por ventas
export const getGanancias = async (_req: Request, res: Response) => {
  try {
    // Fecha inicial: hace 12 meses desde hoy
    const fechaInicio = subMonths(new Date(), 11); // Incluye el mes actual
    const ventas = await prisma.venta.findMany({
      where: {
        fecha: {
          gte: startOfMonth(fechaInicio),
        },
      },
    });

    // Inicializar mapa con los 12 meses
    const gananciasPorMes: { [mes: string]: number } = {};
    for (let i = 0; i < 12; i++) {
      const mes = format(subMonths(new Date(), 11 - i), 'yyyy-MM');
      gananciasPorMes[mes] = 0;
    }

    // Sumar montoPagado por mes
    ventas.forEach((venta: { fecha: Date; montoPagado: number }) => {
      const mesVenta = format(new Date(venta.fecha), 'yyyy-MM');
      if (gananciasPorMes[mesVenta] !== undefined) {
        gananciasPorMes[mesVenta] += venta.montoPagado;
      }
    });

    // Convertir a array de objetos
    const resultado = Object.entries(gananciasPorMes).map(([mes, total]) => ({
      mes,
      total,
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular ganancias por mes' });
  }
};
