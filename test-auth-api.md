# Authentication API Testing Guide

## Test the Authentication Endpoints

### 1. Health Check
```bash
curl http://localhost:3000/api/auth/health
```

### 2. Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "+1234567890"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

### 4. Get Current User (requires token from login response)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Logout (requires token and session ID)
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID_HERE"
  }'
```

### 6. Password Reset Request
```bash
curl -X POST http://localhost:3000/api/auth/password/reset-request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com"
  }'
```

## Expected Responses

### Successful Login Response
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "demo@example.com",
    "name": "Demo User",
    "phone": "+1234567890",
    "role": "user"
  },
  "token": "mock_jwt_token_1234567890",
  "sessionId": "session_1234567890"
}
```

### Error Response
```json
{
  "error": "Invalid email or password"
}
```
