import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys
  openaiApiKey: process.env.OPENAI_API_KEY,
  coinmarketcapApiKey: process.env.COINMARKETCAP_API_KEY,
  
  // Security
  jwtSecret: process.env.JWT_SECRET,
  encryptionKey: process.env.ENCRYPTION_KEY,
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/token-ideator',
  
  // Blockchain
  ethereumRpcUrl: process.env.ETHEREUM_RPC_URL,
  solanaRpcUrl: process.env.SOLANA_RPC_URL,
  usdtContractAddress: process.env.USDT_CONTRACT_ADDRESS,
  
  // Payment
  paymentAmountUsdt: parseFloat(process.env.PAYMENT_AMOUNT_USDT || '2'),
  referralBonusGenerations: parseInt(process.env.REFERRAL_BONUS_GENERATIONS || '1'),
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // AI Configuration
  aiModel: 'gpt-4',
  aiTemperature: 0.8,
  aiMaxTokens: 500,
  
  // Rate Limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,
  
  // Validation
  minProjectIdeaLength: 10,
  maxProjectIdeaLength: 5000,
  
  // Token Validation
  minTokenNameLength: 2,
  maxTokenNameLength: 50,
  minSymbolLength: 1,
  maxSymbolLength: 10,
  
  // PDF Configuration
  pdfFontSize: 11,
  pdfMargin: 50,
  
  // JWT Configuration
  jwtExpiresIn: '30d',
  
  // Payment Expiry
  paymentExpiryMinutes: 15,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};

// Validate required environment variables
export const validateConfig = () => {
  const required = ['OPENAI_API_KEY', 'JWT_SECRET', 'ENCRYPTION_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default config;
