import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import config from '../config/index.js';

const uploadDir = path.resolve(process.cwd(), config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let userPath = req.body.path || '';
    
    userPath = path.normalize(userPath).replace(/^(\.\.[\/\\])+/, '');
  
    const targetPath = path.join(uploadDir, userPath);
  
    if (!targetPath.startsWith(uploadDir)) {
      return cb(new Error('Invalid path.'));
    }
  
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
  
    cb(null, targetPath);
  },
  
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, randomName + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif/;
  const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/gif/;

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 1024 }  // 1GB
});

const uploadMiddleware = (fieldName, multiple = false) => (req, res, next) => {
  const uploader = multiple ? multerUpload.array(fieldName) : multerUpload.single(fieldName);

  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Internal server error during file upload.' });
    }

    if (!multiple && !req.file) {
      return res.status(400).json({ error: `No file uploaded under field "${fieldName}"` });
    }
    const result = req.file

    next(result);
  });
};

export {
  fileFilter,
  uploadMiddleware
};
