// ES 모듈 방식의 모듈 가져오기
import { Calculator, validateNumbers } from './calculator.js';
import { EventEmitter } from 'events';

// 계산기 인스턴스 생성
const calc = new Calculator();
const eventEmitter = new EventEmitter();

// 이벤트 리스너 등록
eventEmitter.on('calculation', ({ operation, numbers, result }) => {
    console.log(`[ESM] 계산 수행: ${numbers.join(' ' + operation + ' ')} = ${result}`);
});

eventEmitter.on('error', (error) => {
    console.error('[ESM] 계산 중 오류 발생:', error.message);
});

// 계산 함수
function calculate(operation, a, b) {
    try {
        // 입력값 검증
        if (!validateNumbers(a, b)) {
            throw new Error('유효한 숫자를 입력해주세요.');
        }

        let result;
        switch (operation) {
            case '+': result = calc.add(a, b); break;
            case '-': result = calc.subtract(a, b); break;
            case '*': result = calc.multiply(a, b); break;
            case '/': result = calc.divide(a, b); break;
            default: throw new Error('지원하지 않는 연산자입니다.');
        }

        eventEmitter.emit('calculation', {
            operation,
            numbers: [a, b],
            result
        });

        return result;
    } catch (error) {
        eventEmitter.emit('error', error);
        return null;
    }
}

// 테스트
console.log('===== ES 모듈 방식 계산기 테스트 =====');
calculate('+', 10, 5);
calculate('-', 10, 5);
calculate('*', 10, 5);
calculate('/', 10, 5);
calculate('/', 10, 0); // 에러 케이스 테스트
calculate('+', 10, 'abc'); // 입력값 검증 테스트
