import { PrismaClient } from '@prisma/client'; // ✅ correcta
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { correo, password, nombre, foto, pais } = req.body;

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        correo: correo.trim().toLowerCase(),
        password,
        nombre,
        foto,
        pais,
      },
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

    const usuario = await prisma.usuario.findUnique({ where: { correo } });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const storedPassword = usuario.password;

    // Detectar si la contraseña guardada es hash de bcrypt
    const esHash = storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$');

    let esCorrecta = false;

    if (esHash) {
      // Comparar con bcrypt
      esCorrecta = await bcrypt.compare(password, storedPassword);
    } else {
      // Comparar texto plano (usuarios antiguos)
      esCorrecta = password === storedPassword;
    }

    if (!esCorrecta) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

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

/* export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Comparar contraseña ingresada con la contraseña hasheada en BD
    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    res.status(200).json({ mensaje: 'Login exitoso', usuario });

  } catch (error) {
    console.error('❗ Error en el login:', error);
    res.status(500).json({ mensaje: 'Error en el login' });
  }
}; */