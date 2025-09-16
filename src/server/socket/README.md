# Socket.IO를 활용한 실시간 통신

## 목차
1. [WebSocket 개요](#websocket-개요)
2. [Socket.IO 기본](#socketio-기본)
3. [이벤트 처리](#이벤트-처리)
4. [룸과 네임스페이스](#룸과-네임스페이스)
5. [에러 처리](#에러-처리)

## WebSocket 개요

WebSocket은 클라이언트와 서버 간의 양방향 통신을 제공하는 프로토콜입니다.

### WebSocket vs HTTP
- HTTP: 요청-응답 기반, 단방향
- WebSocket: 연결 유지, 양방향
- 실시간 데이터 전송에 최적화

## Socket.IO 기본

### 서버 설정
```javascript
import { Server } from 'socket.io';

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
```

### 기본 이벤트
```javascript
io.on('connection', (socket) => {
    console.log('클라이언트 연결:', socket.id);

    socket.on('disconnect', () => {
        console.log('클라이언트 연결 해제:', socket.id);
    });
});
```

## 이벤트 처리

### 커스텀 이벤트
```javascript
// 서버 측
socket.on('chat message', (msg) => {
    io.emit('chat message', {
        user: socket.id,
        message: msg,
        timestamp: new Date()
    });
});

// 클라이언트 측
socket.emit('chat message', '안녕하세요!');
socket.on('chat message', (data) => {
    console.log(`${data.user}: ${data.message}`);
});
```

### 브로드캐스트
```javascript
// 자신을 제외한 모든 클라이언트에게 전송
socket.broadcast.emit('user joined', socket.id);

// 특정 룸의 모든 클라이언트에게 전송
io.to('room1').emit('room message', msg);
```

## 룸과 네임스페이스

### 룸 관리
```javascript
// 룸 참여
socket.on('join room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user joined', {
        user: socket.id,
        room: roomId
    });
});

// 룸 떠나기
socket.on('leave room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user left', {
        user: socket.id,
        room: roomId
    });
});
```

### 네임스페이스
```javascript
// 채팅 네임스페이스
const chat = io.of('/chat');
chat.on('connection', (socket) => {
    // 채팅 관련 이벤트 처리
});

// 알림 네임스페이스
const notifications = io.of('/notifications');
notifications.on('connection', (socket) => {
    // 알림 관련 이벤트 처리
});
```

## 에러 처리

### 연결 에러 처리
```javascript
io.on('connect_error', (err) => {
    console.log('연결 에러:', err.message);
});

socket.on('error', (error) => {
    console.error('소켓 에러:', error);
});
```

### 미들웨어
```javascript
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (isValidToken(token)) {
        next();
    } else {
        next(new Error('인증 실패'));
    }
});
```

## 모범 사례

1. 이벤트 상수 정의
```javascript
const EVENTS = {
    CHAT: 'chat message',
    JOIN: 'join room',
    LEAVE: 'leave room',
    ERROR: 'error'
};
```

2. 에러 처리 통합
```javascript
function handleError(socket, error) {
    logger.error('Socket 에러:', error);
    socket.emit('error', {
        message: '처리 중 오류가 발생했습니다.'
    });
}
```

3. 연결 상태 관리
```javascript
const connectedUsers = new Map();

io.on('connection', (socket) => {
    connectedUsers.set(socket.id, {
        id: socket.id,
        rooms: new Set()
    });

    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
    });
});
```

4. 메시지 검증
```javascript
function validateMessage(message) {
    if (!message || typeof message !== 'string') {
        throw new Error('잘못된 메시지 형식');
    }
    if (message.length > 1000) {
        throw new Error('메시지가 너무 깁니다');
    }
    return message.trim();
}
```

## 실시간 기능 구현 예시

1. 채팅 시스템
```javascript
socket.on('chat message', (data) => {
    try {
        const message = validateMessage(data.message);
        io.to(data.roomId).emit('chat message', {
            user: socket.id,
            message,
            timestamp: new Date()
        });
    } catch (error) {
        handleError(socket, error);
    }
});
```

2. 실시간 알림
```javascript
function sendNotification(userId, notification) {
    io.to(userId).emit('notification', {
        type: notification.type,
        message: notification.message,
        timestamp: new Date()
    });
}
```

## 학습 포인트

1. WebSocket과 Socket.IO 이해
2. 실시간 이벤트 처리
3. 룸과 네임스페이스 활용
4. 에러 처리와 보안
5. 확장 가능한 구조 설계
