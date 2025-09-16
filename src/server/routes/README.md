# Express 라우팅 시스템

## 목차
1. [라우팅 기본 개념](#라우팅-기본-개념)
2. [라우터 구성](#라우터-구성)
3. [미들웨어](#미들웨어)
4. [파일 처리](#파일-처리)
5. [에러 처리](#에러-처리)

## 라우팅 기본 개념

Express에서 라우팅은 클라이언트 요청을 적절한 핸들러 함수에 연결하는 메커니즘입니다.

### HTTP 메서드
```javascript
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
```

### 라우트 매개변수
```javascript
router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    // userId를 사용한 처리
});
```

## 라우터 구성

### 모듈화된 라우터
```javascript
// users.routes.js
import express from 'express';
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);

export default router;

// index.js
import userRouter from './routes/users.routes.js';
app.use('/api/users', userRouter);
```

### 중첩 라우터
```javascript
// posts.routes.js
const postRouter = express.Router({ mergeParams: true });
router.get('/users/:userId/posts', getPosts);
```

## 미들웨어

### 인증 미들웨어
```javascript
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: '인증 필요' });
    }
    next();
}

router.use(authMiddleware);
```

### 요청 검증
```javascript
function validateUser(req, res, next) {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: '필수 필드 누락' });
    }
    next();
}

router.post('/users', validateUser, createUser);
```

## 파일 처리

### Multer 설정
```javascript
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage });
```

### 파일 업로드 라우트
```javascript
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        res.json({ 
            message: '업로드 성공',
            file: {
                filename: file.filename,
                path: file.path
            }
        });
    } catch (error) {
        res.status(500).json({ error: '업로드 실패' });
    }
});
```

## 에러 처리

### 비동기 에러 처리
```javascript
// 비동기 핸들러 래퍼
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}));
```

### 커스텀 에러
```javascript
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

// 에러 핸들러 미들웨어
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: '서버 에러' });
    }
});
```

## 모범 사례

1. 라우트 구조화
```
routes/
  ├── index.js
  ├── auth.routes.js
  ├── users.routes.js
  └── posts.routes.js
```

2. 응답 포맷 통일
```javascript
function sendResponse(res, data, message = 'Success') {
    res.json({
        success: true,
        message,
        data
    });
}
```

3. 요청 검증 미들웨어
```javascript
function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
}
```

## 학습 포인트

1. 라우팅 기본 개념 이해
2. 미들웨어 활용
3. 파일 업로드 처리
4. 에러 처리 전략
5. RESTful API 설계
