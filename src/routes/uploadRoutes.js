import { Router } from 'express';
import { uploadMiddleware } from '../middlewares/upload.js';

export default (config) => {
    const router = Router();
    
    // Single file upload route
    router.post('/upload', (req, res) => {
        uploadMiddleware('file')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            
            // Format successful response
            const fileUrl = `/public/${req.file.filename}`;
            return res.status(200).json({ 
                success: true, 
                file: {
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    url: fileUrl
                }
            });
        });
    });

    // Multiple file upload route
    router.post('/upload-multiple', (req, res) => {
        uploadMiddleware('file', true)(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            
            // Format successful response for multiple files
            const filesData = req.files.map(file => {
                const fileUrl = `/public/${file.filename}`;
                return {
                    filename: file.filename,
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    url: fileUrl
                };
            });
            
            return res.status(200).json({ 
                success: true, 
                files: filesData
            });
        });
    });
    
    return router;
}