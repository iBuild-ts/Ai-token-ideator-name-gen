import express from 'express';
import { verifyToken } from './auth.js';
import { getTokenMetadata } from '../utils/tokenChecker.js';

const router = express.Router();

// Get token metadata
router.get('/metadata/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || symbol.length < 1 || symbol.length > 10) {
      return res.status(400).json({ error: 'Invalid symbol format' });
    }

    const metadata = await getTokenMetadata(symbol);

    res.json({
      success: true,
      symbol,
      ...metadata
    });
  } catch (error) {
    console.error('Token Metadata Error:', error);
    res.status(500).json({ error: 'Failed to retrieve token metadata' });
  }
});

// Get token suggestions based on idea
router.post('/suggest-alternatives', verifyToken, async (req, res) => {
  try {
    const { tokenName, symbol } = req.body;

    if (!tokenName || !symbol) {
      return res.status(400).json({ error: 'Token name and symbol required' });
    }

    // Generate alternatives by checking similar symbols
    const alternatives = [];
    const baseSymbol = symbol.substring(0, 3);

    // Simulate alternative suggestions
    const suffixes = ['X', 'AI', 'PRO', 'DAO', 'FI'];
    for (const suffix of suffixes) {
      const altSymbol = baseSymbol + suffix;
      const metadata = await getTokenMetadata(altSymbol);
      if (!metadata.found) {
        alternatives.push({
          symbol: altSymbol,
          available: true
        });
      }
    }

    res.json({
      success: true,
      originalSymbol: symbol,
      alternatives: alternatives.slice(0, 3)
    });
  } catch (error) {
    console.error('Token Suggestions Error:', error);
    res.status(500).json({ error: 'Failed to generate alternatives' });
  }
});

export default router;
