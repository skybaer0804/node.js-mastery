import { Server } from 'socket.io';
import logger from '../config/logger.js';

export default function initializeSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST"]
        }
    });

    // 연결 이벤트 처리
    io.on('connection', (socket) => {
        logger.info(`클라이언트 연결됨: ${socket.id}`);

        // 채팅방 참여
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            logger.info(`클라이언트 ${socket.id}가 채팅방 ${roomId}에 참여함`);
        });

        // 메시지 수신 및 브로드캐스트
        socket.on('message', (data) => {
            logger.info(`메시지 수신: ${JSON.stringify(data)}`);
            io.to(data.roomId).emit('message', {
                ...data,
                timestamp: new Date(),
                socketId: socket.id
            });
        });

        // 파일 공유 이벤트
        socket.on('file_share', (data) => {
            logger.info(`파일 공유: ${data.filename}`);
            io.to(data.roomId).emit('file_share', {
                ...data,
                timestamp: new Date(),
                socketId: socket.id
            });
        });

        // 연결 해제
        socket.on('disconnect', () => {
            logger.info(`클라이언트 연결 해제: ${socket.id}`);
        });

        // 에러 처리
        socket.on('error', (error) => {
            logger.error('소켓 에러:', error);
        });
    });

    return io;
}
