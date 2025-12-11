import config from '../config.js';

export const validateProjectIdea = (req, res, next) => {
  const { projectIdea } = req.body;

  if (!projectIdea) {
    return res.status(400).json({ error: 'Project idea is required' });
  }

  if (projectIdea.length < config.minProjectIdeaLength) {
    return res.status(400).json({
      error: `Project idea must be at least ${config.minProjectIdeaLength} characters`
    });
  }

  if (projectIdea.length > config.maxProjectIdeaLength) {
    return res.status(400).json({
      error: `Project idea must not exceed ${config.maxProjectIdeaLength} characters`
    });
  }

  next();
};

export const validateTokenData = (req, res, next) => {
  const { tokenName, symbol } = req.body;

  if (!tokenName || !symbol) {
    return res.status(400).json({ error: 'Token name and symbol required' });
  }

  if (tokenName.length < config.minTokenNameLength || tokenName.length > config.maxTokenNameLength) {
    return res.status(400).json({
      error: `Token name must be between ${config.minTokenNameLength} and ${config.maxTokenNameLength} characters`
    });
  }

  if (symbol.length < config.minSymbolLength || symbol.length > config.maxSymbolLength) {
    return res.status(400).json({
      error: `Symbol must be between ${config.minSymbolLength} and ${config.maxSymbolLength} characters`
    });
  }

  // Check for valid characters
  if (!/^[a-zA-Z0-9\s\-]+$/.test(tokenName)) {
    return res.status(400).json({ error: 'Token name contains invalid characters' });
  }

  if (!/^[A-Z0-9]+$/.test(symbol)) {
    return res.status(400).json({ error: 'Symbol must be uppercase alphanumeric' });
  }

  next();
};

export const validateWalletAddress = (req, res, next) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  // Check Ethereum address format (0x + 40 hex chars)
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
  // Check Solana address format (base58, 44 chars)
  const solanaRegex = /^[1-9A-HJ-NP-Z]{44}$/;

  if (!ethereumRegex.test(walletAddress) && !solanaRegex.test(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  next();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePaymentAmount = (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  if (amount !== config.paymentAmountUsdt && amount !== config.paymentAmountUsdt * 5) {
    return res.status(400).json({
      error: `Payment amount must be ${config.paymentAmountUsdt} or ${config.paymentAmountUsdt * 5} USDT`
    });
  }

  next();
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 5000); // Limit length
};
