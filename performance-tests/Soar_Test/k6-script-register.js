import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

export let errorCount = new Counter('errors');

export let options = {
    stages: [
        { duration: '1m', target: 10 }, // ramp up to 10 users
        { duration: '1m', target: 10 }, // stay at 10 users
        { duration: '1m', target: 0 },  // ramp down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
        'http_req_failed': ['rate<0.1'], // Error rate should be less than 1%
        errors: ['count<10'], // Allow up to 10 errors
    },
};

const BASE_URL = `${__ENV.FLASK_URL}`;

export default function () {
    // Generate random data for each iteration
    const payload = {
        fullName: randomString(10),
        userName: randomString(10),
        email: `${randomString(5)}@test.com`,
        password: randomString(10),
        phone: '1234567890'
    };

    // Load testing on /client_registeration
    let registerRes = http.post(`${BASE_URL}/client_registeration`, payload);

    check(registerRes, {
        'register status is 200': (r) => r.status === 200,
        'register response contains User Registered': (r) => r.json().msg === 'User Registered',
    }) || errorCount.add(1);

    sleep(1); // sleep for 1 second to behave like a real user
}
