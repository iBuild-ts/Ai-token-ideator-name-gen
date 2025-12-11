# 🏗️ Token Ideator - System Architecture

## Overview

Token Ideator is a full-stack SaaS platform designed for VCs and crypto founders to generate AI-powered token branding assets. The architecture follows a modern, scalable design pattern.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frontend (HTML5/CSS3/Vanilla JS)                    │   │
│  │  - Wallet Connection (MetaMask/Phantom)             │   │
│  │  - Idea Submission Form                             │   │
│  │  - Results Display                                  │   │
│  │  - PDF Download                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js Server (Port 5000)                       │   │
│  │  - CORS Middleware                                  │   │
│  │  - Rate Limiting (100 req/15min)                    │   │
│  │  - JWT Authentication                              │   │
│  │  - Request Validation                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes & Controllers                               │   │
│  │  ├── auth.js (Wallet auth, JWT)                     │   │
│  │  ├── ideas.js (Idea submission, retrieval)          │   │
│  │  ├── payments.js (Payment processing)               │   │
│  │  └── tokens.js (Token metadata)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   SERVICES LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Utility Services                                    │   │
│  │  ├── aiService.js (OpenAI GPT-4)                    │   │
│  │  ├── tokenChecker.js (CoinGecko API)                │   │
│  │  ├── encryption.js (AES-256)                        │   │
│  │  └── pdfGenerator.js (PDFKit)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES LAYER                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Third-Party APIs                                    │   │
│  │  ├── OpenAI (GPT-4 for generation)                  │   │
│  │  ├── CoinGecko (Token uniqueness)                   │   │
│  │  ├── Ethereum RPC (Payment verification)            │   │
│  │  └── Solana RPC (Alternative blockchain)            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  In-Memory Storage (MVP)                             │   │
│  │  - Ideas Map                                         │   │
│  │  - Payments Map                                      │   │
│  │  - Free Generations Map                             │   │
│  │                                                      │   │
│  │  Future: MongoDB Integration                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer (`public/index.html`)

**Responsibilities:**
- User interface for wallet connection
- Idea submission form
- Results display
- PDF download trigger

**Key Features:**
- Responsive design (mobile-first)
- Real-time validation
- Error handling
- Loading states
- Wallet integration via Web3.js

**Technologies:**
- HTML5 semantic markup
- CSS3 with gradients and animations
- Vanilla JavaScript (no frameworks)
- MetaMask/Phantom integration

### 2. API Gateway Layer (`server.js`)

**Responsibilities:**
- HTTP request routing
- Middleware pipeline
- Error handling
- CORS management

**Middleware Stack:**
```
Request → CORS → JSON Parser → Rate Limiter → Routes → Error Handler → Response
```

**Rate Limiting:**
- 100 requests per 15 minutes per IP
- Prevents abuse and DDoS attacks

### 3. Authentication (`routes/auth.js`)

**Flow:**
```
1. User clicks "Connect Wallet"
2. MetaMask prompts for account selection
3. Frontend sends wallet address to backend
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. All subsequent requests include JWT in Authorization header
```

**JWT Payload:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
  "walletHash": "sha256_hash_of_address",
  "walletType": "MetaMask",
  "connectedAt": "2024-12-11T14:22:53Z",
  "exp": 1735689773
}
```

**Token Expiration:** 30 days

### 4. Idea Generation (`routes/ideas.js`)

**Workflow:**
```
User Submits Idea
    ↓
Validate Input (min 10 chars)
    ↓
Call AI Service (generateTokenBranding)
    ↓
Check Token Uniqueness (tokenChecker)
    ↓
Generate Logo Prompt (aiService)
    ↓
Generate Project Description (aiService)
    ↓
Encrypt & Store Idea
    ↓
Return Results to Frontend
```

**Data Structure:**
```javascript
{
  id: "idea_1",
  walletAddress: "0x...",
  projectIdea: "string",
  founderName: "string",
  industry: "string",
  tokenData: {
    tokenName: "string",
    symbol: "string",
    tagline: "string",
    colors: ["#hex1", "#hex2", "#hex3"],
    visualStyle: "string",
    description: "string"
  },
  logoPrompt: "string",
  projectDescription: "string",
  uniquenessCheck: {
    isUnique: boolean,
    conflicts: [],
    message: "string"
  },
  createdAt: "ISO8601",
  isPaid: boolean
}
```

### 5. AI Service (`utils/aiService.js`)

**Three Main Functions:**

#### a) `generateTokenBranding(projectIdea)`
- Takes project description
- Calls OpenAI GPT-4
- Returns structured JSON with token details
- Temperature: 0.8 (creative but consistent)

**Prompt Engineering:**
```
System: "You are a crypto branding expert. Always respond with valid JSON."
User: "Generate token branding for: [idea]"
Response: JSON with tokenName, symbol, tagline, colors, visualStyle
```

#### b) `generateLogoPrompt(tokenData)`
- Creates detailed DALL-E prompt
- Incorporates token name, colors, style
- Returns prompt string for image generation

#### c) `generateProjectDescription(projectIdea, tokenData)`
- Writes compelling 2-3 paragraph description
- Explains token utility
- Appeals to investors

### 6. Token Uniqueness Checker (`utils/tokenChecker.js`)

**Process:**
```
1. Query CoinGecko API for token name
2. Check for exact symbol match
3. Check for similar symbols
4. Return uniqueness status with conflicts
```

**API Used:** CoinGecko (free, no auth required)

**Response:**
```javascript
{
  isUnique: boolean,
  conflicts: [
    { name: "string", symbol: "string", id: "string" }
  ],
  message: "string",
  warning: boolean // if API unavailable
}
```

### 7. Encryption Service (`utils/encryption.js`)

**Algorithm:** AES-256-CBC

**Process:**
```
Plaintext Data
    ↓
JSON.stringify()
    ↓
Generate Random IV (16 bytes)
    ↓
Encrypt with AES-256-CBC
    ↓
Return { iv, encryptedData }
```

**Security:**
- 256-bit encryption key
- Random IV for each encryption
- Prevents replay attacks

### 8. PDF Generation (`utils/pdfGenerator.js`)

**Output:** Professional PDF with:
- Project details
- Token branding
- Color palette (visual)
- Project description
- Logo design prompt
- Timestamp and confidentiality notice

**Libraries:** PDFKit (pure Node.js, no external dependencies)

### 9. Payment Processing (`routes/payments.js`)

**Free Generation Tracking:**
```
User connects wallet
    ↓
Check if wallet has used free generation
    ↓
If not used: Mark as used after first generation
    ↓
If used: Require payment for additional generations
```

**Payment Flow:**
```
1. User clicks "Generate Again"
2. System checks if free generation available
3. If not: Initiate USDT payment
4. User approves transaction in wallet
5. Backend verifies transaction on blockchain
6. Unlock additional generations
```

**Payment Record:**
```javascript
{
  id: "pay_timestamp_random",
  walletAddress: "0x...",
  amount: 2, // USDT
  ideaId: "idea_1",
  generationCount: 1,
  status: "pending|completed",
  transactionHash: "0x...",
  createdAt: "ISO8601",
  expiresAt: "ISO8601" // 15 min expiry
}
```

## Data Flow Examples

### Example 1: User Generates First Token

```
Frontend                          Backend                    External APIs
   │                               │                            │
   ├─ Connect Wallet ─────────────→│                            │
   │                               ├─ Generate JWT ────────────→│
   │                               │                            │
   │←─────────────── Token ────────┤                            │
   │                               │                            │
   ├─ Submit Idea ────────────────→│                            │
   │ (with JWT)                    ├─ Call OpenAI ────────────→│ GPT-4
   │                               │                            │
   │                               │←─ Token Branding ─────────┤
   │                               │                            │
   │                               ├─ Check CoinGecko ────────→│ CoinGecko
   │                               │                            │
   │                               │←─ Uniqueness Status ──────┤
   │                               │                            │
   │←────── Results ───────────────┤                            │
   │                               │                            │
   ├─ Download PDF ───────────────→│                            │
   │                               ├─ Generate PDF ────────────→│ PDFKit
   │                               │                            │
   │←────── PDF File ──────────────┤                            │
```

### Example 2: User Pays for Additional Generation

```
Frontend                          Backend                    Blockchain
   │                               │                            │
   ├─ Submit Idea (2nd time) ─────→│                            │
   │                               ├─ Check Free Status        │
   │                               │  (already used)            │
   │                               │                            │
   │←─ Payment Required ───────────┤                            │
   │                               │                            │
   ├─ Initiate Payment ───────────→│                            │
   │                               ├─ Create Payment Record    │
   │                               │                            │
   │←─ Payment Details ────────────┤                            │
   │                               │                            │
   ├─ User Approves in Wallet ────→│                            │
   │  (MetaMask)                   │                            │
   │                               │                            │
   │                               ├─ Verify Transaction ─────→│ Ethereum
   │                               │                            │
   │                               │←─ Confirmed ──────────────┤
   │                               │                            │
   │←─ Payment Verified ───────────┤                            │
   │                               │                            │
   ├─ Generate Token (2nd) ───────→│                            │
   │                               ├─ Call OpenAI ────────────→│ GPT-4
   │                               │                            │
   │←────── Results ───────────────┤                            │
```

## Security Architecture

### Authentication & Authorization
```
┌─────────────────────────────────────┐
│  Wallet Connection                  │
│  (MetaMask/Phantom)                 │
└────────────────┬────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│  JWT Token Generation               │
│  (30-day expiration)                │
└────────────────┬────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│  Token Verification Middleware      │
│  (Every protected request)          │
└────────────────┬────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────┐
│  Route Handler Execution            │
└─────────────────────────────────────┘
```

### Data Encryption
```
User Submission
    ↓
Validate Input
    ↓
Encrypt with AES-256-CBC
    ↓
Store Encrypted Data
    ↓
Return Unencrypted Results to User
```

### Rate Limiting
```
Request arrives
    ↓
Check IP address
    ↓
Check request count in 15-min window
    ↓
If count < 100: Allow request
    ↓
If count >= 100: Return 429 Too Many Requests
```

## Scalability Considerations

### Current (MVP)
- In-memory data storage
- Single Node.js process
- Suitable for: <1,000 concurrent users

### Phase 2 (Scale)
- MongoDB for persistence
- Redis for caching
- Horizontal scaling with load balancer
- Suitable for: 1,000-10,000 concurrent users

### Phase 3 (Enterprise)
- Microservices architecture
- Kubernetes orchestration
- CDN for static assets
- Suitable for: 10,000+ concurrent users

## Deployment Architecture

### Development
```
Local Machine
├── Frontend: http://localhost:5000/public/index.html
└── Backend: http://localhost:5000/api/*
```

### Production
```
┌─────────────────────────────────────┐
│  CloudFlare CDN                     │
│  (Global edge caching)              │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
┌──────────────┐  ┌──────────────┐
│ Vercel       │  │ Heroku/AWS   │
│ (Frontend)   │  │ (Backend)    │
└──────────────┘  └──────────────┘
        │                 │
        └────────┬────────┘
                 │
                 ↓
        ┌──────────────────┐
        │ MongoDB Atlas    │
        │ (Database)       │
        └──────────────────┘
```

## Error Handling

### Error Hierarchy
```
User Input Error (400)
    ├── Missing required fields
    ├── Invalid format
    └── Out of range

Authentication Error (401)
    ├── Missing token
    ├── Invalid token
    └── Expired token

Authorization Error (403)
    └── User not owner of resource

Not Found Error (404)
    └── Resource doesn't exist

Rate Limit Error (429)
    └── Too many requests

Server Error (500)
    ├── AI service failure
    ├── Database error
    └── External API failure
```

## Performance Metrics

### Target Response Times
- Wallet connection: <500ms
- Idea submission: 10-15s (AI generation)
- Token uniqueness check: <2s
- PDF generation: <3s
- List ideas: <500ms

### Optimization Strategies
- Caching frequently accessed data
- Async processing for long operations
- CDN for static assets
- Database indexing
- API response compression

---

This architecture provides a solid foundation for the MVP and can scale to enterprise levels with minimal refactoring.
