# Node.js 모듈 시스템

## 목차
1. [모듈 시스템 개요](#모듈-시스템-개요)
2. [CommonJS vs ES Modules](#commonjs-vs-es-modules)
3. [모듈 스코프](#모듈-스코프)
4. [순환 참조](#순환-참조)
5. [모범 사례](#모범-사례)

## 모듈 시스템 개요

Node.js의 모듈 시스템은 코드를 재사용 가능한 단위로 분리하고 구성하는 메커니즘을 제공합니다.

### 모듈의 장점
- **캡슐화**: 코드를 비공개로 유지
- **재사용성**: 코드 재사용 용이
- **의존성 관리**: 명확한 의존성 선언
- **네임스페이스**: 전역 스코프 오염 방지

## CommonJS vs ES Modules

### CommonJS (Node.js 전통적인 모듈 시스템)
```javascript
// 내보내기
module.exports = MyClass;
// 또는
exports.myFunction = function() {};

// 가져오기
const MyClass = require('./my-class');
const { myFunction } = require('./module');
```

특징:
- 동기적 로딩
- Node.js 기본 지원
- 동적 모듈 로딩 가능
- 파일 확장자 생략 가능

### ES Modules (ECMAScript 표준)
```javascript
// 내보내기
export default MyClass;
export const myFunction = () => {};

// 가져오기
import MyClass from './my-class.js';
import { myFunction } from './module.js';
```

특징:
- 정적 분석 가능
- Tree Shaking 지원
- Top-level await 지원
- 브라우저 호환성

## 모듈 스코프

각 모듈은 자체 스코프를 가집니다:

```javascript
// module-a.js
const privateVar = 'private';
export const publicVar = 'public';

// module-b.js
import { publicVar } from './module-a.js';
console.log(publicVar); // 'public'
console.log(privateVar); // ReferenceError
```

### 전역 객체 접근
```javascript
// Node.js 전역 객체
console.log(global); // Node.js
console.log(globalThis); // 표준화된 전역 객체
```

## 순환 참조

순환 참조 처리 방법:

```javascript
// a.js
export let b;
export function setB(value) {
    b = value;
}

// b.js
import { setB } from './a.js';
const b = { value: 'B' };
setB(b);
```

## 모범 사례

1. 명확한 의존성 선언
```javascript
// 좋은 예
import { specific } from './module.js';

// 피해야 할 예
import * as everything from './module.js';
```

2. 단일 책임 원칙
```javascript
// 좋은 예
// user-model.js
export class User { ... }

// user-service.js
export class UserService { ... }
```

3. 인터페이스 명확성
```javascript
// 좋은 예
export interface UserRepository {
    findById(id: string): Promise<User>;
    save(user: User): Promise<void>;
}
```

4. 적절한 파일 구조
```
src/
  ├── models/
  │   └── user.js
  ├── services/
  │   └── user-service.js
  └── repositories/
      └── user-repository.js
```

## 예제 실행

```bash
# CommonJS 예제 실행
npm run start:commonjs

# ES Modules 예제 실행
npm run start:esm
```

## 학습 포인트

1. 모듈 시스템의 차이점 이해
2. 적절한 모듈 시스템 선택
3. 모듈 스코프와 전역 객체
4. 의존성 관리와 순환 참조
5. 모범 사례 적용