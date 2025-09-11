# Node.js 모듈 시스템 비교

## CommonJS vs ES Modules

### 1. CommonJS (전통적인 Node.js 모듈 시스템)

```javascript
// 내보내기
module.exports = MyClass;
// 또는
exports.myFunction = function() {};

// 가져오기
const MyClass = require('./my-class');
// 또는
const { myFunction } = require('./module');
```

특징:
- 동기적으로 동작
- Node.js의 기본 모듈 시스템
- 런타임에 모듈 해석
- 더 유연한 모듈 로딩 (조건부 require 가능)

### 2. ES Modules (ECMAScript 표준 모듈 시스템)

```javascript
// 내보내기
export default MyClass;
// 또는
export const myFunction = () => {};

// 가져오기
import MyClass from './my-class.js';
// 또는
import { myFunction } from './module.js';
```

특징:
- 정적 모듈 구조
- 파일 확장자 필수 (.js)
- 비동기 모듈 로딩 지원
- Top-level await 지원
- Tree-shaking 가능 (더 나은 번들링)

## 주요 차이점

1. 문법
   - CommonJS: require/module.exports
   - ESM: import/export

2. 로딩
   - CommonJS: 동기적
   - ESM: 비동기적 (더 나은 성능)

3. 파일 확장자
   - CommonJS: 생략 가능
   - ESM: 필수

4. 호이스팅
   - CommonJS: 런타임에 평가
   - ESM: 모듈 호이스팅 (정적 분석)

## 예제 실행 방법

```bash
# CommonJS 버전 실행
npm run start:commonjs

# ES 모듈 버전 실행
npm run start:esm
```

## 권장 사항

- 새로운 프로젝트: ES Modules 사용 권장
- 기존 프로젝트: 프로젝트 상황에 따라 선택
- 호환성 필요: CommonJS 사용
- 최신 기능 필요: ES Modules 사용
