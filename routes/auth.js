import express from 'express';
import jwt from 'jsonwebtoken';
import { hashWalletAddress } from '../utils/encryption.js';

const router = express.Router();

// Wallet connection endpoint
router.post('/connect-wallet', (req, res) => {
  try {
    const { walletAddress, walletType } = req.body;

    if (!walletAddress || !walletType) {
      return res.status(400).json({ error: 'Wallet address and type required' });
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress) && walletAddress.length < 32) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        walletAddress: walletAddress.toLowerCase(),
        walletHash: hashWalletAddress(walletAddress),
        walletType,
        connectedAt: new Date().toISOString()
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      walletAddress: walletAddress.toLowerCase(),
      message: 'Wallet connected successfully'
    });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
});

// Verify token
router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      valid: true,
      walletAddress: decoded.walletAddress,
      walletType: decoded.walletType
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
});

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default router;
