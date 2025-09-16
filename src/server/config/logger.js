import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// 로그 포맷 정의
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

// 로거 설정
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        // 콘솔 출력
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        // 일별 로그 파일 생성
        new winston.transports.DailyRotateFile({
            level: 'info',
            dirname: 'logs',
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        }),
        // 에러 로그 별도 저장
        new winston.transports.DailyRotateFile({
            level: 'error',
            dirname: 'logs/error',
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        })
    ]
});

// 개발 환경에서는 자세한 로깅
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export default logger;
