// 가상의 사용자 데이터
const users = [
    { id: 1, name: '김철수', email: 'cheolsu@example.com' },
    { id: 2, name: '박영희', email: 'younghee@example.com' }
];

const posts = [
    { id: 1, userId: 1, title: '첫 번째 게시글', content: '안녕하세요!' },
    { id: 2, userId: 1, title: '두 번째 게시글', content: '반갑습니다!' },
    { id: 3, userId: 2, title: '영희의 게시글', content: '저도 반가워요!' }
];

// 1. 콜백 스타일
export function findUserCallback(id, callback) {
    setTimeout(() => {
        const user = users.find(u => u.id === id);
        if (user) {
            callback(null, user);
        } else {
            callback(new Error('사용자를 찾을 수 없습니다.'));
        }
    }, 1000);
}

export function findPostsByUserCallback(userId, callback) {
    setTimeout(() => {
        const userPosts = posts.filter(p => p.userId === userId);
        callback(null, userPosts);
    }, 1000);
}

// 2. Promise 스타일
export function findUserPromise(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.id === id);
            if (user) {
                resolve(user);
            } else {
                reject(new Error('사용자를 찾을 수 없습니다.'));
            }
        }, 1000);
    });
}

export function findPostsByUserPromise(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userPosts = posts.filter(p => p.userId === userId);
            resolve(userPosts);
        }, 1000);
    });
}

// 3. Async/Await 스타일 (Promise 기반)
export async function findUserWithPosts(id) {
    const user = await findUserPromise(id);
    const posts = await findPostsByUserPromise(id);
    return {
        ...user,
        posts
    };
}

// 4. 병렬 처리 예제
export async function findMultipleUsers(ids) {
    try {
        const promises = ids.map(id => findUserPromise(id));
        const users = await Promise.all(promises);
        return users;
    } catch (error) {
        throw new Error('일부 사용자를 찾는데 실패했습니다: ' + error.message);
    }
}

// 5. 경쟁 상태 예제 (가장 빨리 응답하는 결과 사용)
export async function findUserFastestSource(id) {
    const sources = [
        new Promise((resolve) => setTimeout(() => resolve({ source: 'cache', data: users.find(u => u.id === id) }), 1500)),
        new Promise((resolve) => setTimeout(() => resolve({ source: 'db', data: users.find(u => u.id === id) }), 1000)),
        new Promise((resolve) => setTimeout(() => resolve({ source: 'api', data: users.find(u => u.id === id) }), 2000))
    ];

    try {
        const { source, data } = await Promise.race(sources);
        console.log(`데이터 소스: ${source}`);
        return data;
    } catch (error) {
        throw new Error('사용자 조회 실패: ' + error.message);
    }
}
