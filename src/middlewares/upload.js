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
    const userPath = req.body?.path || ''; // optional path from request body
    
    const normalizedUserPath = path.normalize(userPath).replace(/^(\.\.[\/\\])+/, '');
  
    const targetPath = path.join(uploadDir, normalizedUserPath);
  
    if (!targetPath.startsWith(uploadDir)) {
      return cb(new Error('Invalid path.'));
    }
  
    // Create directory if it doesn't exist
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
    cb(new Error(`File type not allowed: ${file.originalname}`));
  }
};

const uploadMiddleware = (fieldName, multiple = false) => {
  const uploader = multiple 
    ? multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 10 } }).array(fieldName) // 10MB limit
    : multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 10 } }).single(fieldName);
  
  return uploader;
};

export {
  fileFilter,
  uploadMiddleware
};