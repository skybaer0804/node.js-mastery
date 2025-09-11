// ES 모듈 시스템 예제
export class Calculator {
    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) {
            throw new Error('0으로 나눌 수 없습니다.');
        }
        return a / b;
    }
}

// 추가 유틸리티 함수 내보내기 예제
export const isNumber = (value) => typeof value === 'number' && !isNaN(value);
export const validateNumbers = (...args) => args.every(isNumber);
