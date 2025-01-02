import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

export let errorCount = new Counter('errors');

export let options = {
    stages: [
        { duration: '1m', target: 10 }, // ramp up to 10 users
        { duration: '3m', target: 10 }, // stay at 10 users
        { duration: '1m', target: 0 },  // ramp down to 0 users
    ],
    thresholds: {
        errors: ['count<10'], // Allow up to 10 errors
    },
};

const BASE_URL = 'http://localhost:5001';

export default function () {
    // Generate random data for each iteration
    const fullName = randomString(10);
    const userName = randomString(10);
    const email = `${randomString(5)}@example.com`;
    const password = randomString(10);
    const phone = `1234567890`;

    // Load testing on /client_registeration
    let registerRes = http.post(`${BASE_URL}/client_registeration`, {
        fullName: fullName,
        userName: userName,
        email: email,
        password: password,
        phone: phone,
    });

    check(registerRes, {
        'register status is 200': (r) => r.status === 200,
        'register response contains User Registered': (r) => r.json().msg === 'User Registered',
    }) || errorCount.add(1);

    sleep(1);
}
