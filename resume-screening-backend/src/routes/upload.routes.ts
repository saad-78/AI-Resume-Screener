import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { extractText } from '../services/pdf.service.js';
import { chunkText } from '../utils/chunker.js';
import { storeChunks } from '../services/vector.service.js';
import { analyzeMatch } from '../services/analysis.service.js';
import { UploadResponse } from '../types/index.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'text/plain'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and TXT files allowed'));
        }
    },
});

/**
 * POST /api/upload
 * Upload resume + job description and get match analysis
 */
router.post(
    '/',
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'jobDescription', maxCount: 1 },
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files.resume || !files.jobDescription) {
                res.status(400).json({ error: 'Both resume and job description required' });
                return;
            }

            const resumeFile = files.resume[0];
            const jdFile = files.jobDescription[0];

            // Extract text from files
            const resumeText = await extractText(resumeFile.path, resumeFile.mimetype);
            const jdText = await extractText(jdFile.path, jdFile.mimetype);

            // Generate IDs
            const resumeId = uuidv4();
            const jdId = uuidv4();

            // Chunk texts
            const resumeChunks = chunkText(resumeText, resumeId, 'resume');
            const jdChunks = chunkText(jdText, jdId, 'job_description');

            // Store in ChromaDB (parallel)
            await storeChunks(resumeChunks, 'resume_chunks');
            await storeChunks(jdChunks, 'job_description_chunks');

            // Analyze match
            const analysis = await analyzeMatch(resumeText, jdText);

            const response: UploadResponse = {
                resumeId,
                jobDescriptionId: jdId,
                analysis,
            };

            res.status(200).json(response);
        } catch (error: any) {
            console.error('❌ Upload error:', error);
            res.status(500).json({ error: error.message || 'Upload failed' });
        }
    }
);

export default router;
