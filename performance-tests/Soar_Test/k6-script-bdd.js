import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

export let options = {
   stages: [
       { duration: '2m', target: 10 },
       { duration: '5m', target: 10 },
       { duration: '1m', target: 0 }
   ],
   thresholds: {
       'http_req_duration': ['p(95)<1000'],
       'http_req_failed': ['rate<0.1']
   }
};

export default function () {
   const registerData = {
       fullName: randomString(10),
       userName: randomString(8),
       email: `${randomString(5)}@test.com`,
       password: randomString(10),
       phone: '1234567890'
   };

   let registerRes = http.post(`${__ENV.FLASK_URL}/client_registeration`, registerData);
   check(registerRes, {
        'register status is 200': (r) => r.status === 200,
        'register response': (r) => r.json().msg === 'User Registered'
   });

   sleep(2); // sleep for 2 seconds to behave like a real user
 
   const params = {
       headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
       }
   };

   const loginData = {
       userName: registerData.userName,
       email: registerData.email,
       password: registerData.password
   };

   let loginRes = http.post(`${__ENV.FLASK_URL}/client_login`, loginData, params);
   check(loginRes, {
       'login status is 200': (r) => r.status === 200,
       'token present': (r) => JSON.parse(r.body).hasOwnProperty('token')
   });

   sleep(2); // sleep for 2 seconds to behave like a real user
}