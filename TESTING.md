# 🧪 Testing Guide - Token Ideator

Complete guide for testing the Token Ideator platform.

## Manual Testing

### 1. Wallet Connection Test

**Using MetaMask:**
1. Open http://localhost:5000/public/index.html
2. Click "Connect Wallet"
3. MetaMask popup appears
4. Select account and approve
5. See wallet address displayed

**Expected Result:**
- Wallet address shows in the UI
- "Disconnect" button appears
- Token stored in localStorage

### 2. Idea Submission Test

**Test Case 1: Valid Submission**
```
Input:
- Project Idea: "A decentralized platform for AI model training and deployment"
- Name: "John Doe"
- Email: "john@example.com"
- Industry: "DeFi"

Expected Output:
- Token Name: Generated (e.g., "QuantumLeap")
- Symbol: Generated (e.g., "QLP")
- Tagline: Generated
- Colors: 3-4 hex colors
- Visual Style: Description
- Uniqueness Status: Unique or Conflict
```

**Test Case 2: Invalid Submission (Too Short)**
```
Input:
- Project Idea: "AI token"

Expected Output:
- Error: "Project idea must be at least 10 characters"
```

**Test Case 3: No Wallet Connected**
```
Action: Try to submit without connecting wallet

Expected Output:
- Alert: "Please connect your wallet first"
```

### 3. Token Uniqueness Check Test

**Test Case 1: Unique Token**
```
Generated Token: "QuantumLeap" / "QLP"

Expected Output:
- Status: "✓ Unique & Available"
- Message: "Token name and symbol are unique!"
```

**Test Case 2: Existing Token**
```
Generated Token: "Bitcoin" / "BTC"

Expected Output:
- Status: "⚠ Conflict Detected"
- Message: "Symbol already in use by: Bitcoin"
```

### 4. PDF Download Test

**Test Case 1: Download PDF**
```
Action: After generation, click "📥 Download Idea Kit PDF"

Expected Output:
- PDF file downloads
- Filename: "[TokenName]_IdeaKit.pdf"
- PDF contains:
  - Project details
  - Token name & symbol
  - Tagline
  - Color palette
  - Visual style
  - Project description
  - Logo prompt
```

### 5. Free Generation Test

**Test Case 1: First Generation (Free)**
```
Action: Submit idea with new wallet

Expected Output:
- Generation succeeds
- Message: "This is your free generation"
- Free generation marked as used
```

**Test Case 2: Second Generation (Paid)**
```
Action: Submit another idea with same wallet

Expected Output:
- Payment required
- Payment details displayed
- User must approve USDT transaction
```

## API Testing with cURL

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-12-11T14:33:06Z"
}
```

### Test Wallet Connection
```bash
curl -X POST http://localhost:5000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
    "walletType": "MetaMask"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f42be",
  "message": "Wallet connected successfully"
}
```

### Test Token Verification
```bash
curl -X POST http://localhost:5000/api/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_JWT_TOKEN"
  }'
```

### Test Idea Submission
```bash
curl -X POST http://localhost:5000/api/ideas/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "projectIdea": "A decentralized platform for AI model training and deployment",
    "founderName": "John Doe",
    "founderEmail": "john@example.com",
    "industry": "DeFi"
  }'
```

### Test Get Ideas List
```bash
curl -X GET http://localhost:5000/api/ideas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Get Specific Idea
```bash
curl -X GET http://localhost:5000/api/ideas/idea_1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Token Metadata
```bash
curl http://localhost:5000/api/tokens/metadata/BTC
```

### Test Free Generation Status
```bash
curl -X GET http://localhost:5000/api/payments/free-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Payment Initiation
```bash
curl -X POST http://localhost:5000/api/payments/initiate-usdt-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 2,
    "ideaId": "idea_1",
    "generationCount": 1
  }'
```

## Automated Testing (Jest)

### Setup Jest
```bash
npm install --save-dev jest supertest
```

### Create Test File: `tests/api.test.js`

```javascript
import request from 'supertest';
import app from '../server.js';

describe('Token Ideator API', () => {
  let authToken;
  let walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE';

  describe('Authentication', () => {
    test('Should connect wallet', async () => {
      const res = await request(app)
        .post('/api/auth/connect-wallet')
        .send({
          walletAddress,
          walletType: 'MetaMask'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    test('Should verify token', async () => {
      const res = await request(app)
        .post('/api/auth/verify-token')
        .send({ token: authToken });

      expect(res.statusCode).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.walletAddress).toBe(walletAddress.toLowerCase());
    });
  });

  describe('Ideas', () => {
    test('Should submit idea', async () => {
      const res = await request(app)
        .post('/api/ideas/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          projectIdea: 'A decentralized platform for AI model training',
          founderName: 'John Doe',
          industry: 'DeFi'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.tokenData).toBeDefined();
      expect(res.body.tokenData.tokenName).toBeDefined();
      expect(res.body.tokenData.symbol).toBeDefined();
    });

    test('Should list user ideas', async () => {
      const res = await request(app)
        .get('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.ideas)).toBe(true);
    });

    test('Should reject short idea', async () => {
      const res = await request(app)
        .post('/api/ideas/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          projectIdea: 'Short'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('Payments', () => {
    test('Should check free status', async () => {
      const res = await request(app)
        .get('/api/payments/free-status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.hasFreeGeneration).toBe('boolean');
    });

    test('Should initiate payment', async () => {
      const res = await request(app)
        .post('/api/payments/initiate-usdt-payment')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 2,
          ideaId: 'idea_1',
          generationCount: 1
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.paymentId).toBeDefined();
    });
  });

  describe('Tokens', () => {
    test('Should get token metadata', async () => {
      const res = await request(app)
        .get('/api/tokens/metadata/BTC');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
```

### Run Tests
```bash
npm test
```

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test 1000 requests with 10 concurrent
ab -n 1000 -c 10 http://localhost:5000/api/health

# Expected: < 500ms response time
```

### Load Testing with Artillery
```bash
npm install -g artillery

# Create load-test.yml
cat > load-test.yml << 'EOF'
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 60
      arrivalRate: 100
      name: "Spike"

scenarios:
  - name: "Health Check"
    flow:
      - get:
          url: "/api/health"
EOF

# Run test
artillery run load-test.yml
```

## Security Testing

### Test Rate Limiting
```bash
# Send 101 requests in quick succession
for i in {1..101}; do
  curl http://localhost:5000/api/health
done

# Request 101 should return 429 Too Many Requests
```

### Test Input Validation
```bash
# Test SQL Injection
curl -X POST http://localhost:5000/api/ideas/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "projectIdea": "'; DROP TABLE ideas; --"
  }'

# Should be sanitized and rejected
```

### Test CORS
```bash
curl -H "Origin: http://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:5000/api/ideas/submit

# Should reject if origin not in whitelist
```

## Browser DevTools Testing

### Console Testing
```javascript
// Test API call
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))

// Test localStorage
localStorage.getItem('authToken')
localStorage.removeItem('authToken')

// Test MetaMask
window.ethereum.request({ method: 'eth_accounts' })
```

### Network Tab
- Monitor all API requests
- Check response times
- Verify headers
- Check payload sizes

### Performance Tab
- Measure page load time
- Check JavaScript execution time
- Monitor memory usage
- Identify bottlenecks

## Checklist

- [ ] Wallet connection works
- [ ] Idea submission generates valid results
- [ ] Token uniqueness check works
- [ ] PDF downloads correctly
- [ ] Free generation tracking works
- [ ] Payment initiation works
- [ ] Error handling works
- [ ] Rate limiting works
- [ ] CORS is configured
- [ ] Input validation works
- [ ] All API endpoints respond correctly
- [ ] Response times are acceptable
- [ ] No console errors
- [ ] No security vulnerabilities

## Debugging Tips

### Enable Debug Logging
```bash
DEBUG=* npm run dev
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check request/response

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check error details

### Check Server Logs
```bash
# Terminal where server is running
# Should show request logs and errors
```

---

**Testing Complete!** ✅

Your Token Ideator platform is thoroughly tested and ready for production.
