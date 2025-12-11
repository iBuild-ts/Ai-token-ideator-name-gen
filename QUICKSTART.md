# 🚀 Quick Start Guide - Token Ideator

Get your Token Ideator platform running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd /Users/horlahdefi/CascadeProjects/token-ideator
npm install
```

This installs all required packages including Express, OpenAI, Web3, and PDF generation tools.

## Step 2: Get Your API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it (you'll need GPT-4 access)

### CoinGecko API (Free)
- No key needed! CoinGecko's free API is public
- Used for token uniqueness checking

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:
```
OPENAI_API_KEY=sk-your-actual-key-here
JWT_SECRET=your-secret-key-at-least-32-characters-long
ENCRYPTION_KEY=<run the command below>
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `ENCRYPTION_KEY` in `.env`

## Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Token Ideator Server running on port 5000
Environment: development
```

## Step 5: Open the Platform

Open your browser and go to:
```
http://localhost:5000/public/index.html
```

## Step 6: Test the Platform

### Connect Your Wallet
1. Click "Connect Wallet" button
2. MetaMask will pop up
3. Select your account and approve
4. You'll see your wallet address

### Generate Your First Token
1. Enter a project idea (e.g., "A decentralized AI training platform")
2. Optionally add your name and industry
3. Click "Generate Token Branding"
4. Wait 10-15 seconds for AI to generate
5. See your token name, symbol, colors, and more!

### Download Your Idea Kit
1. After generation, click "📥 Download Idea Kit PDF"
2. A PDF with all your branding assets will download

## 🎯 What You Get

Each generation includes:
- ✨ **Token Name** - Unique, catchy name
- 💰 **Symbol** - 3-5 character ticker (e.g., $APUR)
- 🎨 **Color Palette** - 3-4 colors for branding
- 📝 **Tagline** - Catchy project tagline
- 🖼️ **Visual Style** - Description for logo design
- 📄 **Project Description** - 2-3 paragraph overview
- 🎯 **Logo Prompt** - DALL-E prompt for logo generation

## 💡 Example Ideas to Try

1. **DeFi Project**: "A decentralized lending protocol with AI-powered risk assessment"
2. **Meme Coin**: "A dog-themed cryptocurrency for the gaming community"
3. **NFT Platform**: "Marketplace for AI-generated art with blockchain authentication"
4. **Gaming Token**: "Play-to-earn gaming token with metaverse integration"
5. **Utility Token**: "Token for decentralized cloud computing network"

## 🔧 Troubleshooting

### "Cannot find module 'openai'"
```bash
npm install openai
```

### "OPENAI_API_KEY is not defined"
- Make sure you created `.env` file
- Check that OPENAI_API_KEY is set correctly
- Restart the server after changing .env

### "MetaMask not found"
- Install MetaMask extension: https://metamask.io
- Or use Phantom for Solana: https://phantom.app

### Port 5000 already in use
```bash
# Use a different port
PORT=5001 npm run dev
```

## 📊 API Testing

### Test with cURL

**Connect Wallet:**
```bash
curl -X POST http://localhost:5000/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
    "walletType": "MetaMask"
  }'
```

**Check Health:**
```bash
curl http://localhost:5000/api/health
```

## 🚀 Next Steps

1. **Customize the UI** - Edit `public/index.html`
2. **Add Database** - Connect MongoDB for persistence
3. **Deploy** - Push to Vercel (frontend) and Heroku (backend)
4. **Add Features** - Image generation, advanced analytics, etc.

## 📚 Documentation

- Full API docs: See `README.md`
- Project structure: See `README.md`
- Security features: See `README.md`

## 💬 Need Help?

1. Check the console for error messages
2. Review `README.md` for detailed documentation
3. Check API response messages for hints

## 🎉 You're Ready!

Your Token Ideator platform is now running. Start generating amazing token ideas!

---

**Pro Tips:**
- 🆓 First generation is FREE per wallet
- 💰 Additional generations cost $2 USDT
- 📥 Always download your PDF before leaving
- 🔒 Your ideas are encrypted and private
- ⚡ Generations take 10-15 seconds

Happy ideating! 🚀
