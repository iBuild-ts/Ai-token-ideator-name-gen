# 🚀 Deployment Guide - Token Ideator

Complete guide to deploy Token Ideator to production environments.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API keys obtained (OpenAI, etc.)
- [ ] Database setup (if using MongoDB)
- [ ] Security audit completed
- [ ] Load testing passed
- [ ] Error handling tested
- [ ] CORS configured for production domain
- [ ] SSL/TLS certificates ready

## Option 1: Deploy to Vercel + Heroku (Recommended for MVP)

### Frontend Deployment (Vercel)

**Step 1: Prepare Frontend**
```bash
# Create a vercel.json config
cat > vercel.json << 'EOF'
{
  "buildCommand": "echo 'Frontend ready'",
  "outputDirectory": "public",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
```

**Step 2: Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Step 3: Configure Environment**
- Go to Vercel Dashboard
- Project Settings → Environment Variables
- Add: `REACT_APP_API_URL=https://your-backend.herokuapp.com`

### Backend Deployment (Heroku)

**Step 1: Create Heroku App**
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create token-ideator-api
```

**Step 2: Configure Environment Variables**
```bash
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set JWT_SECRET=your-secret
heroku config:set ENCRYPTION_KEY=your-key
heroku config:set NODE_ENV=production
heroku config:set COINMARKETCAP_API_KEY=your-key
```

**Step 3: Deploy**
```bash
# Add Heroku remote
heroku git:remote -a token-ideator-api

# Deploy
git push heroku main
```

**Step 4: View Logs**
```bash
heroku logs --tail
```

### Update CORS for Production

Edit `server.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-vercel-domain.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## Option 2: Deploy to AWS (Scalable)

### Architecture
```
CloudFront (CDN)
    ↓
API Gateway
    ↓
Lambda (Backend)
    ↓
RDS (Database)
```

### Step 1: Prepare Code for Lambda

Create `lambda.js`:
```javascript
import serverless from 'serverless-http';
import app from './server.js';

export const handler = serverless(app);
```

Install dependency:
```bash
npm install serverless-http
```

### Step 2: Deploy with Serverless Framework

```bash
# Install Serverless
npm install -g serverless

# Configure AWS credentials
serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET

# Create serverless.yml
cat > serverless.yml << 'EOF'
service: token-ideator

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    OPENAI_API_KEY: ${env:OPENAI_API_KEY}
    JWT_SECRET: ${env:JWT_SECRET}
    ENCRYPTION_KEY: ${env:ENCRYPTION_KEY}

functions:
  api:
    handler: lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true

plugins:
  - serverless-offline
EOF

# Deploy
serverless deploy
```

### Step 3: Setup RDS Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier token-ideator-db \
  --db-instance-class db.t3.micro \
  --engine mongodb \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20
```

### Step 4: Setup CloudFront

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## Option 3: Deploy to DigitalOcean (Budget-Friendly)

### Step 1: Create Droplet

```bash
# Using doctl CLI
doctl compute droplet create token-ideator \
  --region nyc3 \
  --image ubuntu-22-04-x64 \
  --size s-1vcpu-1gb
```

### Step 2: Setup Server

```bash
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/token-ideator.git
cd token-ideator

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start server.js --name "token-ideator"
pm2 startup
pm2 save
```

### Step 3: Setup Nginx Reverse Proxy

```bash
# Install Nginx
apt install -y nginx

# Create config
cat > /etc/nginx/sites-available/token-ideator << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/token-ideator /etc/nginx/sites-enabled/

# Test and restart
nginx -t
systemctl restart nginx
```

### Step 4: Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot certonly --nginx -d your-domain.com

# Auto-renewal
systemctl enable certbot.timer
```

## Option 4: Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - MONGODB_URI=mongodb://mongo:27017/token-ideator
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Deploy

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Should return:
# {"status":"Server is running","timestamp":"2024-12-11T..."}
```

### 2. Setup Monitoring

**Using Sentry for Error Tracking:**
```bash
npm install @sentry/node
```

Add to `server.js`:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### 3. Setup Logging

**Using Winston:**
```bash
npm install winston
```

### 4. Configure Backups

```bash
# MongoDB backup (daily)
0 2 * * * mongodump --uri="mongodb://..." --out=/backups/$(date +\%Y\%m\%d)
```

### 5. Setup CDN for Static Assets

```javascript
// In server.js
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

## Scaling Strategies

### Horizontal Scaling
```
Load Balancer
    ├── Instance 1
    ├── Instance 2
    └── Instance 3
```

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Upgrade database tier
- Increase cache size

### Database Optimization
```javascript
// Add indexes
db.ideas.createIndex({ walletAddress: 1 });
db.ideas.createIndex({ createdAt: -1 });
db.payments.createIndex({ status: 1 });
```

## Performance Optimization

### 1. Enable Compression
```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Implement Caching
```javascript
import redis from 'redis';
const client = redis.createClient();

app.get('/api/tokens/metadata/:symbol', async (req, res) => {
  const cached = await client.get(`token:${req.params.symbol}`);
  if (cached) return res.json(JSON.parse(cached));
  
  // Fetch and cache
  const data = await getTokenMetadata(req.params.symbol);
  await client.setEx(`token:${req.params.symbol}`, 3600, JSON.stringify(data));
  res.json(data);
});
```

### 3. Database Connection Pooling
```javascript
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring & Alerts

### Key Metrics to Monitor
- API response time
- Error rate
- Database query time
- Memory usage
- CPU usage
- Active connections

### Setup Alerts
- Error rate > 1%
- Response time > 5s
- Database down
- Out of memory
- High CPU usage

## Rollback Procedure

```bash
# If deployment fails
heroku rollback

# Or manually
git revert <commit-hash>
git push heroku main

# Or with Docker
docker-compose down
docker-compose up -d
```

## Security Hardening

### 1. Update Dependencies
```bash
npm audit
npm audit fix
npm update
```

### 2. Set Security Headers
```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 3. Enable HTTPS Only
```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 4. Database Security
- Use strong passwords
- Enable encryption at rest
- Restrict network access
- Regular backups
- Point-in-time recovery

## Cost Estimation

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Vercel (Frontend) | $0-20 | Free tier available |
| Heroku (Backend) | $7-50 | Hobby to Standard tier |
| MongoDB Atlas | $0-100 | Free tier available |
| OpenAI API | $0-100 | Pay-as-you-go |
| Domain | $10-15 | Annual |
| **Total** | **$17-285** | Depends on scale |

## Troubleshooting

### 502 Bad Gateway
- Check backend logs
- Verify environment variables
- Check database connection

### High Memory Usage
- Implement caching
- Optimize database queries
- Increase server resources

### Slow API Response
- Add database indexes
- Implement caching
- Optimize AI prompts
- Use CDN

---

**Deployment Complete!** 🎉

Your Token Ideator platform is now live and ready for users.
