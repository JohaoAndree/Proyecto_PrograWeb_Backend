import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';
import type { RecuperarPasswordBody, NuevaClaveBody } from '../../types/request-bodies';

// Recuperar contraseña - genera token y lo manda por correo
const recuperar = async (req: Request<{}, {}, RecuperarPasswordBody>, res: Response) => {
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
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { token, tokenExpiry },
  });

  const link = `${env.FRONTEND_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Soporte Juegos" <${env.EMAIL_USER}>`,
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
const nuevaClave = async (req: Request<{ token: string }, {}, NuevaClaveBody>, res: Response) => {
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

    if (!usuario || !usuario.tokenExpiry || usuario.tokenExpiry < new Date()) {
      console.log("❌ Token inválido o expirado:", token);
      return res.status(400).json({ mensaje: "Token inválido o expirado." });
    }

    const hash = await bcrypt.hash(nuevaClave, 10);
    console.log("🔒 Hash generado:", hash);

    const actualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hash,
        token: null,
        tokenExpiry: null,
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