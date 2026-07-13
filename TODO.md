# TODO - Security hardening remaining recommendations

- [x] Step 1: Eliminate XSS sinks in `frontend/app.js` for activities/goals by removing risky `innerHTML` templating and using DOM-safe rendering.
- [x] Step 1.1: Remove remaining XSS sinks in `frontend/app.js` (ledger tables/history/search rendering + modal/chat rendering) still using `innerHTML`/template interpolation.



- [x] Step 2: Harden session cookie defaults in `auth-backend` (`SessionService.java`) so `Secure` is enforced in production.


- [x] Step 3: Tighten Spring Security CSRF handling in `SecurityConfig.java` (re-enable CSRF with safe defaults, keep only necessary exceptions).

- [ ] Step 4: Normalize auth/OTP error messages to reduce information leakage (if required by `AuthException` + `GlobalExceptionHandler`).
- [ ] Step 5: Run build/tests for affected frontends/backends and verify login/session restore.

