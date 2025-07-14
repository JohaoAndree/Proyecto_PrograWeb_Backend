import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { correo, password, nombre, foto } = req.body;
    const nuevoUsuario = await prisma.usuario.create({
      data: { correo: correo.trim().toLowerCase(), password, nombre, foto }
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    console.log('📩 Correo recibido:', correo);
    console.log('🔑 Contraseña recibida:', password);

    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    console.log('✅ Usuario encontrado:', usuario.correo);
    console.log('🆚 Comparando:', usuario.password, 'vs', password);

    if (usuario.password !== password) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso');
    res.status(200).json({ mensaje: 'Login exitoso', usuario });

  } catch (error) {
    console.error('❗ Error en el login:', error);
    res.status(500).json({ mensaje: 'Error en el login' });
  }
};


export const obtenerPerfil = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
};

export const actualizarPerfil = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data
    });

    res.status(200).json({
      mensaje: 'Perfil actualizado correctamente',
      nombre: usuario.nombre,
      correo: usuario.correo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
};

export const eliminarDelCarrito = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const carritoEliminado = await prisma.carrito.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ mensaje: 'Juego eliminado del carrito', carritoEliminado });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ mensaje: 'Error al eliminar del carrito' });
  }
};
