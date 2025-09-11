import {
    findUserCallback,
    findPostsByUserCallback,
    findUserPromise,
    findPostsByUserPromise,
    findUserWithPosts,
    findMultipleUsers,
    findUserFastestSource
} from './user-service.js';

// 1. 콜백 스타일 테스트
console.log('1. 콜백 패턴 테스트');
findUserCallback(1, (error, user) => {
    if (error) {
        console.error('사용자 조회 실패:', error.message);
        return;
    }

    console.log('사용자 찾음:', user);
    findPostsByUserCallback(user.id, (error, posts) => {
        if (error) {
            console.error('게시글 조회 실패:', error.message);
            return;
        }

        console.log('사용자의 게시글:', posts);
    });
});

// 2. Promise 스타일 테스트
console.log('\n2. Promise 패턴 테스트');
findUserPromise(1)
    .then(user => {
        console.log('사용자 찾음:', user);
        return findPostsByUserPromise(user.id);
    })
    .then(posts => {
        console.log('사용자의 게시글:', posts);
    })
    .catch(error => {
        console.error('에러 발생:', error.message);
    });

// 3. Async/Await 스타일 테스트
console.log('\n3. Async/Await 패턴 테스트');
async function testAsyncAwait() {
    try {
        const userWithPosts = await findUserWithPosts(1);
        console.log('사용자와 게시글:', userWithPosts);
    } catch (error) {
        console.error('에러 발생:', error.message);
    }
}
testAsyncAwait();

// 4. 병렬 처리 테스트
console.log('\n4. 병렬 처리 테스트');
async function testParallel() {
    try {
        const users = await findMultipleUsers([1, 2]);
        console.log('여러 사용자 동시 조회:', users);
    } catch (error) {
        console.error('에러 발생:', error.message);
    }
}
testParallel();

// 5. 경쟁 상태 테스트
console.log('\n5. 가장 빠른 응답 사용 테스트');
async function testFastestSource() {
    try {
        const user = await findUserFastestSource(1);
        console.log('가장 빠른 소스의 사용자 데이터:', user);
    } catch (error) {
        console.error('에러 발생:', error.message);
    }
}
testFastestSource();
