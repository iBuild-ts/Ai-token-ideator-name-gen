# 🚀 Token Ideator - AI-Powered Crypto Token Branding Platform

An innovative SaaS platform that helps VCs, founders, and crypto enthusiasts generate unique token names, symbols, logos, and branding assets using AI. Built for the modern crypto ecosystem.

## 🎯 Features

- **Wallet Integration**: Connect via MetaMask or Phantom for seamless authentication
- **AI-Powered Generation**: Uses OpenAI GPT-4 to generate:
  - Unique, catchy token names
  - Short ticker symbols (3-5 characters)
  - Compelling taglines
  - Color palettes for branding
  - Visual style descriptions
  - Logo design prompts
  - Project descriptions

- **Token Uniqueness Check**: Cross-references generated names against existing crypto tokens via CoinGecko API
- **PDF Export**: Download complete "Idea Kit" with all generated assets
- **Freemium Model**: 
  - 1 free generation per wallet
  - $2 USDT for additional generations
  - Bundle pricing available

- **Security & Privacy**:
  - End-to-end encryption for submissions
  - JWT-based authentication
  - Rate limiting to prevent abuse
  - GDPR/CCPA compliant data handling

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **AI**: OpenAI GPT-4 API
- **Blockchain**: ethers.js, Web3.js
- **Database**: MongoDB (optional, currently in-memory)
- **Security**: JWT, bcryptjs, crypto
- **PDF Generation**: PDFKit

### Frontend
- **HTML5/CSS3/Vanilla JavaScript**
- **Web3 Integration**: MetaMask/Phantom wallet support
- **Responsive Design**: Mobile-first approach

## 📋 Prerequisites

- Node.js 16+ and npm
- OpenAI API key (GPT-4 access)
- CoinGecko API (free tier available)
- MetaMask or Phantom wallet for testing

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd /Users/horlahdefi/CascadeProjects/token-ideator
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
OPENAI_API_KEY=sk-your-key-here
COINMARKETCAP_API_KEY=your-key-here
JWT_SECRET=your-secret-key-min-32-chars
ENCRYPTION_KEY=your-32-char-hex-key
PORT=5000
NODE_ENV=development
```

Generate a secure encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start the Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 4. Access the Platform

Open `http://localhost:5000/public/index.html` in your browser

## 📡 API Endpoints

### Authentication
- `POST /api/auth/connect-wallet` - Connect crypto wallet
- `POST /api/auth/verify-token` - Verify JWT token

### Ideas
- `POST /api/ideas/submit` - Submit project idea and generate branding
- `GET /api/ideas` - List user's ideas
- `GET /api/ideas/:ideaId` - Get specific idea details
- `GET /api/ideas/:ideaId/download-pdf` - Download idea kit PDF

### Payments
- `GET /api/payments/free-status` - Check free generation status
- `POST /api/payments/use-free-generation` - Mark free generation as used
- `POST /api/payments/initiate-usdt-payment` - Initiate USDT payment
- `POST /api/payments/verify-payment` - Verify payment completion
- `GET /api/payments/history` - Get payment history

### Tokens
- `GET /api/tokens/metadata/:symbol` - Get token metadata
- `POST /api/tokens/suggest-alternatives` - Get alternative symbol suggestions

## 🔐 Security Features

1. **Wallet-Based Authentication**: No passwords, uses Web3 signatures
2. **JWT Tokens**: 30-day expiration for sessions
3. **Data Encryption**: AES-256-CBC for sensitive submissions
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS Protection**: Configured for production domains
6. **Input Validation**: All user inputs validated server-side

## 💰 Pricing Model

| Tier | Cost | Features |
|------|------|----------|
| Free | $0 | 1 generation per wallet |
| Pay-per-use | $2 USDT | Each additional generation |
| Bundle | $8 USDT | 5 generations |
| Premium | $20 USDT/month | Unlimited generations + priority support |

## 📊 Project Structure

```
token-ideator/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
├── README.md                # This file
├── public/
│   └── index.html          # Frontend UI
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── ideas.js            # Idea submission & retrieval
│   ├── payments.js         # Payment processing
│   └── tokens.js           # Token metadata endpoints
└── utils/
    ├── aiService.js        # OpenAI integration
    ├── tokenChecker.js     # Token uniqueness verification
    ├── encryption.js       # Data encryption/decryption
    └── pdfGenerator.js     # PDF export functionality
```

## 🔄 Workflow

1. **User connects wallet** → Receives JWT token
2. **User submits project idea** → AI generates token branding
3. **System checks uniqueness** → Verifies against existing tokens
4. **Results displayed** → Shows token name, symbol, colors, etc.
5. **User downloads PDF** → Gets complete "Idea Kit"
6. **Optional payment** → For additional generations

## 🧪 Testing

### Test Wallet Connection
```bash
curl -X POST http://localhost:5000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
    "walletType": "MetaMask"
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
    "industry": "DeFi"
  }'
```

## 🚀 Deployment

### Deploy to Vercel (Frontend)
```bash
vercel deploy
```

### Deploy to Heroku (Backend)
```bash
heroku create token-ideator
heroku config:set OPENAI_API_KEY=your_key
git push heroku main
```

### Deploy to AWS
- Use AWS Lambda for serverless backend
- S3 for PDF storage
- RDS for MongoDB
- CloudFront for CDN

## 📈 Growth Strategy

1. **MVP Launch** (Week 1-2): Deploy to ProductHunt, crypto subreddits
2. **Community Building** (Week 3-4): Discord/Twitter engagement
3. **Partnerships** (Week 5-8): Integrate with token launchpads (Pump.fun, etc.)
4. **Premium Features** (Week 9-12): Advanced variations, NFT minting
5. **Viral Growth**: Referral bonuses, affiliate program

## 🎯 Success Metrics

- **User Acquisition**: 1,000 users in month 1
- **Conversion Rate**: 10-15% free to paid
- **Monthly Revenue**: $1,000-5,000 (conservative estimate)
- **Retention**: 30-day retention rate > 40%

## 🐛 Known Limitations (MVP)

- In-memory data storage (no persistence)
- No actual blockchain payment verification
- Limited to OpenAI models
- No image generation (DALL-E integration pending)
- No user dashboard/analytics

## 🔮 Future Enhancements

- [ ] DALL-E integration for logo generation
- [ ] MongoDB integration for data persistence
- [ ] Actual blockchain payment processing
- [ ] User dashboard with analytics
- [ ] Community voting on names
- [ ] NFT minting integration
- [ ] Multi-language support
- [ ] Advanced AI models (Claude, Grok)
- [ ] Token launch integration (Pump.fun, etc.)
- [ ] Mobile app (React Native)

## 📞 Support

For issues or questions:
1. Check the GitHub issues
2. Join our Discord community
3. Email: support@tokenideator.com

## 📄 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This platform is for ideation purposes only. Generated token names are not guaranteed to be legally unique. Always conduct proper trademark research before launching a token. Consult legal counsel regarding SEC compliance and regulations.

---

**Built with ❤️ for the crypto community**

*Last Updated: December 2024*
