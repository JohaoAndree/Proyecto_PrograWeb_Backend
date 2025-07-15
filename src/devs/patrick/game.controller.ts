import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';//npm install prisma @prisma/client
import crypto from 'crypto';//npm install bcrypt
import nodemailer from 'nodemailer';//npm install nodemailer
import bcrypt from 'bcrypt'; // npm install --save-dev @types/bcrypt
import { env } from '../../config/env';



const prisma = new PrismaClient();

// Recuperar contraseña - genera token y lo manda por correo
const recuperar = async (req: Request, res: Response) => {
  const { correo } = req.body;

  console.log("📨 Correo recibido:", correo);

  if (!correo) {
    return res.status(400).json({ mensaje: 'Correo es requerido.' });
  }

  const correoLimpio = correo.trim();
  const usuario = await prisma.usuario.findFirst({
    where: {
      correo: {
        equals: correoLimpio,
        mode: "insensitive",
      },
    },
  });

  if (!usuario) {
    return res.status(404).json({ mensaje: 'El correo no está registrado.' });
  }

  const token = crypto.randomBytes(32).toString('hex');

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { token },
  });

  const link = `${env.FRONTEND_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'patrick.ch1429@gmail.com',
      pass: 'ndkf saom dsfu nfdw', //  Usa un app password real en producción
    },
  });

  await transporter.sendMail({
    from: '"Soporte Juegos" <patrick.ch1429@gmail.com>',
    to: correoLimpio,
    subject: 'Recupera tu contraseña',
    html: `
      <h3>Hola 👋</h3>
      <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
      <a href="${link}" style="color:blue;">Recuperar contraseña</a>
      <p>Si no solicitaste esto, puedes ignorar el mensaje.</p>
    `,
  });

  return res.status(200).json({ mensaje: 'Se envió un enlace para restablecer la contraseña.' });
};

// Cambiar contraseña - usa el token para validar y actualizar la clave
const nuevaClave = async (req: Request, res: Response) => {
  const { nuevaClave } = req.body;
  const token = req.params.token;

  console.log("🔐 Token recibido:", token);
  console.log("🔑 Nueva clave recibida:", nuevaClave);

  if (!token || !nuevaClave) {
    console.log("⚠️ Faltan datos en la solicitud.");
    return res.status(400).json({ mensaje: "Faltan datos." });
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: { token },
    });

    if (!usuario) {
      console.log("❌ No se encontró un usuario con el token:", token);
      return res.status(400).json({ mensaje: "Token inválido o expirado." });
    }

    const hash = await bcrypt.hash(nuevaClave, 10);
    console.log("🔒 Hash generado:", hash);

    const actualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hash,
        token: null,
      },
    });

    console.log("✅ Usuario actualizado:", actualizado);

    return res.status(200).json({ mensaje: "Contraseña actualizada correctamente." });

  } catch (error) {
    console.error("🔥 Error al actualizar la clave:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

 /*const actualizarPerfil = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, correo, foto } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !correo) {
    return res.status(400).json({ mensaje: "Nombre y correo son obligatorios." });
  }

  try {
    
    const dataToUpdate: any = { nombre, correo };
    if (foto && foto.trim() !== "") {
      dataToUpdate.foto = foto;
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return res.status(200).json({
      mensaje: "✅ Perfil actualizado correctamente.",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return res.status(500).json({ mensaje: "❌ Error al actualizar perfil." });
  }
};*/
// Exportación explícita al final
export { recuperar, nuevaClave };