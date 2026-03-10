import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/imagenes/noticia'));
  },
  filename: (req, file, cb) => {
    // Limpiar el nombre original para evitar path traversal
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const nombreArchivo = `${Date.now()}-${cleanName}`;
    cb(null, nombreArchivo);
  },
});

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, PNG, WebP, GIF)'));
    }
  },
});