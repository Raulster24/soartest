// k6-script-bdd.js 
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
   // Given a new user registration
   const registerData = {
       fullName: randomString(10),
       userName: randomString(8),
       email: `${randomString(5)}@test.com`,
       password: randomString(10),
       phone: '1234567890'
   };

   // When registering the user
   let registerRes = http.post(`${__ENV.FLASK_URL}/client_registeration`, registerData);
   
   check(registerRes, {
       'register status is 200': (r) => r.status === 200,
       'registration successful': (r) => r.json().msg === 'User Registered'
   });

   sleep(1);

   // Then login with registered credentials
   const loginData = {
       email: registerData.email,
       password: registerData.password
   };

   let loginRes = http.post(`${__ENV.FLASK_URL}/client_login`, loginData);
   
   check(loginRes, {
       'login status is 200': (r) => r.status === 200,
       'login successful': (r) => r.json().msg === 'Login Success'
   });

   sleep(1);
}