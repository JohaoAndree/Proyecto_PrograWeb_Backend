export const recuperar = async (req: Request, res: Response) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'Correo es requerido.' });
  }

  // Simulación de envío — aquí va tu lógica con Nodemailer y token (si quieres agregar)
  console.log(`📨 Enviando enlace de recuperación a: ${correo}`);

  return res.status(200).json({ mensaje: 'Se envió un enlace para restablecer la contraseña.' });
};