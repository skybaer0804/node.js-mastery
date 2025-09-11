# Node.js 비동기 프로그래밍

Node.js에서 비동기 프로그래밍을 구현하는 세 가지 주요 방식을 살펴봅니다.

## 1. 콜백 패턴

전통적인 비동기 처리 방식으로, 함수의 실행이 완료되면 콜백 함수가 호출됩니다.

```javascript
findUserCallback(id, (error, user) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(user);
});
```

장점:
- 간단하고 직관적
- 오래된 코드와의 호환성

단점:
- 콜백 지옥 (Callback Hell)
- 에러 처리가 복잡
- 비동기 흐름 제어가 어려움

## 2. Promise 패턴

비동기 작업의 미래 결과를 나타내는 객체를 사용합니다.

```javascript
findUserPromise(id)
    .then(user => console.log(user))
    .catch(error => console.error(error));
```

장점:
- 체이닝 가능
- 더 나은 에러 처리
- 비동기 흐름 제어가 개선됨

단점:
- 콜백에 비해 약간의 오버헤드
- 여전히 코드가 복잡해질 수 있음

## 3. Async/Await 패턴

Promise를 더 동기적인 스타일로 작성할 수 있게 해줍니다.

```javascript
async function getUser(id) {
    try {
        const user = await findUserPromise(id);
        console.log(user);
    } catch (error) {
        console.error(error);
    }
}
```

장점:
- 가장 읽기 쉬운 코드
- 동기 코드와 유사한 스타일
- try/catch로 에러 처리

단점:
- async 함수는 항상 Promise를 반환
- 이전 버전의 Node.js와 호환성 문제 가능

## 고급 패턴

### 1. 병렬 처리 (Promise.all)
여러 비동기 작업을 동시에 실행합니다.

```javascript
const users = await Promise.all([
    findUserPromise(1),
    findUserPromise(2)
]);
```

### 2. 경쟁 상태 (Promise.race)
여러 소스 중 가장 빠른 응답을 사용합니다.

```javascript
const result = await Promise.race([
    source1Promise,
    source2Promise
]);
```

## 실행 방법

```bash
# 예제 실행
node src/async/main.js
```

## 학습 포인트

1. 각 패턴의 특징과 사용 시기
2. 에러 처리 방식의 차이
3. 비동기 흐름 제어
4. 성능과 리소스 관리
5. 동시성 처리
