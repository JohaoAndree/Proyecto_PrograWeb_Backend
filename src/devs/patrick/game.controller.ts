import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export const recuperar = async (req: Request, res: Response) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'Correo es requerido.' });
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo } });

  if (!usuario) {
    return res.status(404).json({ mensaje: 'El correo no está registrado.' });
  }

  const token = crypto.randomBytes(32).toString('hex');

  await prisma.usuario.update({
    where: { correo },
    data: { token },
  });

  const link = `http://localhost:5020/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'patrick.ch1429@gmail.com',       // 👈 Reemplaza con el tuyo
      pass: 'hola',     // 👈 Usa una contraseña de aplicación, no la personal
    },
  });

  await transporter.sendMail({
    from: '"Soporte Juegos" <tucorreo@gmail.com>',
    to: correo,
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