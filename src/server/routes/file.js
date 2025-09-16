import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import logger from '../config/logger.js';

const router = express.Router();

// 파일 저장 설정
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = 'uploads';
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB 제한
    }
});

// 파일 업로드
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('파일이 없습니다.');
        }

        logger.info(`파일 업로드 성공: ${req.file.filename}`);
        res.json({
            message: '파일 업로드 성공',
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                path: req.file.path
            }
        });
    } catch (error) {
        logger.error('파일 업로드 실패:', error);
        res.status(400).json({ error: error.message });
    }
});

// 파일 다운로드
router.get('/download/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join('uploads', filename);

        await fs.access(filepath);
        logger.info(`파일 다운로드: ${filename}`);
        res.download(filepath);
    } catch (error) {
        logger.error('파일 다운로드 실패:', error);
        res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }
});

// 파일 목록 조회
router.get('/list', async (req, res) => {
    try {
        const files = await fs.readdir('uploads');
        const fileStats = await Promise.all(
            files.map(async (filename) => {
                const stats = await fs.stat(path.join('uploads', filename));
                return {
                    filename,
                    size: stats.size,
                    createdAt: stats.birthtime
                };
            })
        );

        logger.info('파일 목록 조회');
        res.json(fileStats);
    } catch (error) {
        logger.error('파일 목록 조회 실패:', error);
        res.status(500).json({ error: '파일 목록을 가져올 수 없습니다.' });
    }
});

export default router;
