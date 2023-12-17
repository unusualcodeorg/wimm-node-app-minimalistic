import path from 'path';
import { disk } from '../config';
import multer from 'multer';

const diskPath = path.resolve(__dirname, '../..', disk.path);

const imageStorage = multer.diskStorage({
  destination: diskPath,
  filename(_, file, callback) {
    callback(null, getFilename(file));
  },
});

export function uploadImage() {
  return multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_, file, callback) {
      const extension =
        ['.png', '.jpg', '.jpeg'].indexOf(
          path.extname(file.originalname).toLowerCase(),
        ) >= 0;

      const mimeType =
        ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.mimetype) >= 0;

      if (extension && mimeType) {
        return callback(null, true);
      }
      callback(
        new Error(
          'Invalid file type. Only picture file on type PNG and JPG are allowed!',
        ),
      );
    },
  }).single('image');
}

function getFilename(file: Express.Multer.File) {
  const mimetype = file.mimetype.toLowerCase();

  let fileName = file.originalname;
  fileName = fileName
    .split('/')
    .join('')
    .split(' ')
    .join('_')
    .split('?')
    .join('');
  const parts = fileName.split('.');

  let extension = parts.splice(-1, 1)?.toString()?.toLowerCase();
  fileName = parts.join('-');

  if (!extension) extension = mimetype.split('/').pop()?.toLowerCase() || '';
  fileName = `${fileName}_${Date.now()}.${extension}`;

  return fileName;
}
