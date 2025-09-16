import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import fileRouter from './routes/file.js';
import initializeSocket from './socket/index.js';
import logger from './config/logger.js';

// 환경변수 설정
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use('/uploads', express.static('uploads'));

// 라우터 설정
app.use('/api/files', fileRouter);

// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: '실시간 파일 공유 서버' });
});

// 웹소켓 초기화
const io = initializeSocket(httpServer);

// 전역 에러 핸들러
app.use((err, req, res, next) => {
    logger.error('서버 에러:', err);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
});

// 서버 시작
httpServer.listen(PORT, () => {
    logger.info(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
