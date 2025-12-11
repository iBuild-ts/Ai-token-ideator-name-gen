import express from 'express';
import { verifyToken } from './auth.js';

const router = express.Router();

// Store payment records in memory (in production, use MongoDB)
const payments = new Map();
const freeGenerations = new Map();

// Get user's free generation status
router.get('/free-status', verifyToken, (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    const hasFreeGeneration = !freeGenerations.has(walletAddress);

    res.json({
      success: true,
      walletAddress,
      hasFreeGeneration,
      message: hasFreeGeneration ? 'Free generation available' : 'Free generation already used'
    });
  } catch (error) {
    console.error('Free Status Error:', error);
    res.status(500).json({ error: 'Failed to check free generation status' });
  }
});

// Mark free generation as used
router.post('/use-free-generation', verifyToken, (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    const { ideaId } = req.body;

    if (!ideaId) {
      return res.status(400).json({ error: 'Idea ID required' });
    }

    if (freeGenerations.has(walletAddress)) {
      return res.status(400).json({ error: 'Free generation already used' });
    }

    freeGenerations.set(walletAddress, {
      ideaId,
      usedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Free generation marked as used'
    });
  } catch (error) {
    console.error('Use Free Generation Error:', error);
    res.status(500).json({ error: 'Failed to mark free generation' });
  }
});

// Initiate USDT payment (Ethereum)
router.post('/initiate-usdt-payment', verifyToken, async (req, res) => {
  try {
    const { amount, ideaId, generationCount } = req.body;
    const walletAddress = req.user.walletAddress;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment record
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentRecord = {
      id: paymentId,
      walletAddress,
      amount,
      ideaId,
      generationCount: generationCount || 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min expiry
    };

    payments.set(paymentId, paymentRecord);

    // In production, integrate with actual payment processor
    // For now, return payment details for frontend to handle
    res.json({
      success: true,
      paymentId,
      amount,
      currency: 'USDT',
      walletAddress,
      message: 'Payment initiated. Please complete the transaction in your wallet.',
      instructions: {
        network: 'Ethereum',
        recipient: process.env.USDT_CONTRACT_ADDRESS,
        amount: `${amount} USDT`,
        memo: `Token Ideator - ${ideaId}`
      }
    });
  } catch (error) {
    console.error('Payment Initiation Error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Verify payment completion
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { paymentId, transactionHash } = req.body;

    if (!paymentId || !transactionHash) {
      return res.status(400).json({ error: 'Payment ID and transaction hash required' });
    }

    const payment = payments.get(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.walletAddress !== req.user.walletAddress) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // In production, verify transaction on blockchain
    // For MVP, mark as completed
    payment.status = 'completed';
    payment.transactionHash = transactionHash;
    payment.completedAt = new Date().toISOString();

    res.json({
      success: true,
      paymentId,
      status: 'completed',
      message: 'Payment verified successfully',
      generationsUnlocked: payment.generationCount
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get payment history
router.get('/history', verifyToken, (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    const userPayments = Array.from(payments.values())
      .filter(payment => payment.walletAddress === walletAddress && payment.status === 'completed')
      .map(payment => ({
        id: payment.id,
        amount: payment.amount,
        generationCount: payment.generationCount,
        completedAt: payment.completedAt,
        transactionHash: payment.transactionHash
      }));

    res.json({
      success: true,
      count: userPayments.length,
      payments: userPayments
    });
  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).json({ error: 'Failed to retrieve payment history' });
  }
});

export default router;
