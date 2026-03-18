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
      <!doctype html>
          <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&display=swap" rel="stylesheet">
            <title>Recuperar Contraseña - GameStore</title>
          </head>
          <body style="margin:0;background:linear-gradient(180deg,#030313 0%, #0b0e1a 100%);font-family: 'Fira Code', monospace;color:#E2E8F0;padding: 20px;">
            <div style="max-width:600px;margin:20px auto;padding:32px;border-radius:24px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(0,209,255,0.1);box-shadow:0 15px 35px rgba(0,0,0,0.4);">

              <header style="text-align:center;margin-bottom:32px;">
                <h2 style="margin:0;color:#00D1FF;font-size:24px;font-weight:700;letter-spacing:-0.02em;">
                  Restablecer Contraseña
                </h2>
                <div style="font-size:14px;color:#94A3B8;margin-top:8px;text-transform:uppercase;letter-spacing:0.1em;">
                  Seguridad de Cuenta
                </div>
              </header>

              <main style="text-align:center;">
                <p style="margin:0 0 20px 0;color:#cbd5e1;line-height:1.6;font-size:16px;">
                  Hola 👋 <br/>
                  Hemos recibido una solicitud para cambiar tu contraseña en <strong style="color:#fff">GameStore</strong>.
                </p>

                <p style="margin:0 0 32px 0;color:#cbd5e1;font-size:15px;">
                  Haz clic en el botón de abajo para configurar una nueva clave de acceso:
                </p>

                <a href="${link}" style="display:inline-block;padding:14px 28px;border-radius:12px;background:linear-gradient(90deg,#00D1FF,#3a7bd5);color:#071126;font-weight:700;text-decoration:none;font-size:16px;box-shadow: 0 4px 15px rgba(0,209,255,0.3);">
                  Recuperar Contraseña
                </a>

                <p style="margin:32px 0 0 0;color:#64748b;font-size:13px;line-height:1.5;">
                  Si no solicitaste este cambio, puedes ignorar este mensaje con total seguridad. Tu contraseña actual no se verá afectada.
                </p>
              </main>

              <footer style="margin-top:40px;border-top:1px solid rgba(226,232,240,0.05);padding-top:24px;color:#94A3B8;font-size:13px;text-align:center;">
                <div style="margin-bottom:4px;">Atentamente,</div>
                <div style="font-weight:700;color:#00D1FF;">Equipo GameStore</div>
              </footer>
            </div>
          </body>
          </html>
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

export { recuperar, nuevaClave };