# Node.js 서버 설정 관리

## 목차
1. [설정 관리 개요](#설정-관리-개요)
2. [환경 변수](#환경-변수)
3. [로깅 시스템](#로깅-시스템)
4. [보안 설정](#보안-설정)
5. [모범 사례](#모범-사례)

## 설정 관리 개요

서버 애플리케이션의 설정을 효과적으로 관리하는 방법을 설명합니다.

### 설정 관리의 중요성
- 환경별 설정 분리 (개발/테스트/운영)
- 민감한 정보 보호
- 유지보수성 향상
- 설정 변경의 유연성

## 환경 변수

### dotenv를 사용한 환경 변수 관리
```javascript
import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*'
};
```

### .env 파일 구조
```env
# 서버 설정
PORT=3000
NODE_ENV=development

# CORS 설정
CORS_ORIGIN=http://localhost:5173

# 파일 업로드 설정
MAX_FILE_SIZE=5242880
```

## 로깅 시스템

### Winston 로거 설정
```javascript
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            filename: 'logs/application-%DATE%.log'
        })
    ]
});
```

### 로그 레벨
- error: 오류 상황
- warn: 경고 상황
- info: 일반 정보
- debug: 디버깅 정보
- verbose: 상세 정보

### 로그 포맷
```javascript
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});
```

## 보안 설정

### CORS 설정
```javascript
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
};
```

### 파일 업로드 제한
```javascript
const uploadLimits = {
    fileSize: process.env.MAX_FILE_SIZE,
    files: 5
};
```

## 모범 사례

1. 환경별 설정 파일 분리
```
config/
  ├── default.js
  ├── development.js
  ├── test.js
  └── production.js
```

2. 설정 유효성 검사
```javascript
function validateConfig(config) {
    const required = ['PORT', 'NODE_ENV'];
    for (const key of required) {
        if (!config[key]) {
            throw new Error(`Missing required config: ${key}`);
        }
    }
}
```

3. 보안 설정 관리
```javascript
// 프로덕션 환경 특수 설정
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.Syslog());
    corsOptions.origin = 'https://production.domain.com';
}
```

4. 로깅 전략
```javascript
// 개발 환경에서 자세한 로깅
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}
```

## 설정 사용 예시

```javascript
// 설정 가져오기
import config from './config.js';

// 서버 설정 적용
app.listen(config.port, () => {
    logger.info(`서버가 포트 ${config.port}에서 실행 중입니다.`);
});

// 로깅 예시
logger.info('애플리케이션 시작');
logger.error('오류 발생', new Error('상세 오류 내용'));
```

## 학습 포인트

1. 환경 변수 관리 방법
2. 로깅 시스템 구성
3. 보안 설정 관리
4. 환경별 설정 분리
5. 설정 유효성 검사
