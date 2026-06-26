import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, uploadsDir);
  },
  filename(_req, file, callback) {
    const ext = path.extname(file.originalname);
    const hash = crypto.randomBytes(16).toString('hex');
    callback(null, `${hash}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Formato de imagem inválido. Use JPEG, PNG ou WebP.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
