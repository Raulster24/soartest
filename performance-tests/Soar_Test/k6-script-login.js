// k6-script-login.js - Stress Test
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
   stages: [
       { duration: '2m', target: 10 },
       { duration: '3m', target: 15 },
       { duration: '3m', target: 20 },
       { duration: '2m', target: 0 }
   ],
   thresholds: {
       'http_req_failed': ['rate<0.1'],
       'http_req_duration': ['p(95)<2000']
   }
};

export default function () {
    const payload = {
        userName: 'admin',
        email: 'admin@test.com', 
        password: 'admin@1234'
    };

    const params = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

   let res = http.post(`${__ENV.FLASK_URL}/client_login`, payload, params);
   check(res, {
    'status is 200': (r) => r.status === 200,
    'token present in response': (r) => JSON.parse(r.body).hasOwnProperty('token')
   });
   sleep(1);
}