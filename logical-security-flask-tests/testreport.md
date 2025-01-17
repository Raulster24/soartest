# Security and Logical Vulnerability Report

Following are the list of the logical and security testing finding, Please also have a look at the attached screenshots in this directory for actual tests performed as evidence

CVSS calculator - https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator

## Critical (CVSS 9.0-10.0)

| ID | Type | Issue | Risk | Description | Impact | PoC / Code Areas |
|----|------|-------|------|-------------|---------|-----|
| 1 | Security | SQL Injection | 9.8 | Direct string concatenation | Database breach | `userName=" OR "1"="1"` |
| 2 | Security | Plaintext Passwords | 9.1 | No password hashing | Credential exposure | `dbCursor.execute("INSERT INTO users (..., password, ...) VALUES (?, ?, ?, ?, ?, ?)", (..., password, ...)` |
| 3 | Logical | Username-only Auth | 9.5 | No password required | Account takeover | Username only login `elif userName != '':dbData = dbCursor.execute(qUser).fetchall()` |
| 4 | Logical | Missing Password Check | 9.0 | No validation | Auth bypass | Skip password `elif userName != '': qUser = 'select privillage from users where userName = "' + userName +'"'dbData = dbCursor.execute(qUser).fetchall()` |

## High (CVSS 7.0-8.9) 

| ID | Type | Issue | Risk | Description | Impact | PoC/ Code Areas |
|----|------|-------|------|-------------|---------|-----|
| 5 | Security | Input Validation | 7.5 | Missing validation | Data injection | Special chars - refer security test 3 screenshot |
| 8 | Security | No Input Sanitization | 7.5 | Raw form input | XSS possible | No validation, possible script injection `fullName = request.form['fullName']`<br>`userName = request.form['userName']`<br>`email = request.form['email']` |
| 9 | Security | No CSRF Protection | 7.0 | Missing tokens | CSRF attacks | No protection, No request origin verification |
| 10 | Logical | No Account Lockout | 7.0 | Unlimited attempts | Brute force | Multiple tries |
| 11 | Security | JWT Issues | 7.5 | Algorithm risks | Token forge | Algorithm not explicitly set |

## Medium (CVSS 4.0-6.9)

| ID | Type | Issue | Risk | Description | Impact | PoC |
|----|------|-------|------|-------------|---------|-----|
| 12 | Security | No Rate Limiting | 5.3 | No limits | DoS possible | Flood requests |
| 13 | Security | Insecure JWT | 5.0 | Unverified data | Token tampering | Modify payload - Role can be tampered by modifying token |
| 14 | Logical | Email Format | 5.5 | No validation | Invalid data | Wrong format |
| 15 | Security | JWT Data Leak | 5.0 | Sensitive info | Info disclosure | View token data |
| 16 | Logical | Username Duplicates | 5.0 | No uniqueness | Confusion | Same usernames |
| 17 | Security | Privilege Exposure | 5.5 | Role in JWT | Role visibility | Check token |
| 18 | Logical | Error Messages | 4.0 | Inconsistent | User enum | Different msgs |
| 19 | Security | Static Privilege | 5.0 | Hardcoded '2' | Role prediction | Known value |
| 20 | Logical | No Length Limit | 4.5 | Unbounded | Buffer issues | Long input |
| 21 | Security | No Access Logs | 5.0 | No tracking | No audit | Missing logs |
| 22 | Security | Password Reset | 5.5 | No recovery | Lock out risk | Can't reset |
| 23 | Security | Missing Headers | 5.0 | No security headers | Click-jacking | No CSP |
| 24 | Security | DB Connection | 4.5 | No pooling | Resource drain | Connection leak |
| 25 | Security | Error Handling | 4.0 | Poor handling | Info leak | Stack trace |

## Low (CVSS 0.1-3.9)

| ID | Type | Issue | Risk | Description | Impact | PoC |
|----|------|-------|------|-------------|---------|-----|
| 26 | Logical | Empty Strings | 3.5 | Space bypass | Data issues | Whitespace |
| 27 | Security | DB Close | 3.0 | Not closed | Resource leak | Connection pool |
| 28 | Security | Content-Type | 3.0 | Not enforced | MIME attacks | Wrong type |
| 29 | Security | HTTP Method | 3.5 | No validation | Method confusion | Wrong method |
| 30 | Logical | Input Trim | 3.0 | No trimming | Data inconsistency | Extra spaces |

## Summary

- Total: 30 vulnerabilities
- Critical: 4
- High: 7 
- Medium: 14
- Low: 5
- Security: 20
- Logical: 10

## Affected Endpoints
- /client_registration
- /client_login