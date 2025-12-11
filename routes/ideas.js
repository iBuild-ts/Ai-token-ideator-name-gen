import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateTokenBranding, generateAlternativeNames, getTrendingIdeas } from '../utils/customAI.js';
import { checkTokenUniqueness } from '../utils/tokenChecker.js';
import { encryptData, decryptData } from '../utils/encryption.js';
import { generateIdeaKitPDF } from '../utils/pdfGenerator.js';
import { validateProjectIdea } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
// Store ideas in memory (in production, use MongoDB)
const ideas = new Map();
let ideaCounter = 1;

// Submit project idea
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { projectIdea, founderName, founderEmail, industry } = req.body;
    const walletAddress = req.user.walletAddress;

    if (!projectIdea || projectIdea.trim().length < 10) {
      return res.status(400).json({ error: 'Project idea must be at least 10 characters' });
    }

    // Generate token branding using custom AI
    const tokenData = await generateTokenBranding(projectIdea);

    // Check uniqueness
    const uniquenessCheck = await checkTokenUniqueness(tokenData.tokenName, tokenData.symbol);

    // Create idea object
    const ideaId = `idea_${ideaCounter++}`;
    const ideaObject = {
      id: ideaId,
      walletAddress,
      projectIdea,
      founderName: founderName || 'Anonymous',
      founderEmail: founderEmail || null,
      industry: industry || 'General',
      tokenData,
      logoPrompt: tokenData.logoPrompt,
      projectDescription: tokenData.description,
      uniquenessCheck,
      createdAt: new Date().toISOString(),
      isPaid: false
    };

    // Encrypt sensitive data (optional - use default key if not set)
    let encryptedIdea = null;
    try {
      const encKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';
      encryptedIdea = encryptData(ideaObject, encKey);
    } catch (encError) {
      console.warn('Encryption skipped:', encError.message);
      encryptedIdea = null;
    }
    
    ideas.set(ideaId, { ...ideaObject, encrypted: encryptedIdea });

    res.json({
      success: true,
      ideaId,
      tokenData: {
        tokenName: tokenData.tokenName,
        symbol: tokenData.symbol,
        theme: tokenData.theme,
        tagline: tokenData.tagline,
        description: tokenData.description,
        colorPalette: tokenData.colorPalette,
        visualStyle: tokenData.visualStyle,
        logoPrompt: tokenData.logoPrompt,
        redditInsights: tokenData.redditInsights
      },
      uniquenessCheck,
      message: 'Idea generated successfully! This is your free generation.'
    });
  } catch (error) {
    console.error('Submit Idea Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate token branding' });
  }
});

// Get idea details
router.get('/:ideaId', verifyToken, (req, res) => {
  try {
    const { ideaId } = req.params;
    const idea = ideas.get(ideaId);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    if (idea.walletAddress !== req.user.walletAddress) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json({
      success: true,
      idea: {
        id: idea.id,
        projectIdea: idea.projectIdea,
        founderName: idea.founderName,
        industry: idea.industry,
        tokenData: idea.tokenData,
        projectDescription: idea.projectDescription,
        logoPrompt: idea.logoPrompt,
        uniquenessCheck: idea.uniquenessCheck,
        createdAt: idea.createdAt,
        isPaid: idea.isPaid
      }
    });
  } catch (error) {
    console.error('Get Idea Error:', error);
    res.status(500).json({ error: 'Failed to retrieve idea' });
  }
});

// List user's ideas
router.get('/', verifyToken, (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    const userIdeas = Array.from(ideas.values())
      .filter(idea => idea.walletAddress === walletAddress)
      .map(idea => ({
        id: idea.id,
        projectIdea: idea.projectIdea,
        tokenName: idea.tokenData.tokenName,
        symbol: idea.tokenData.symbol,
        createdAt: idea.createdAt,
        isPaid: idea.isPaid
      }));

    res.json({
      success: true,
      count: userIdeas.length,
      ideas: userIdeas
    });
  } catch (error) {
    console.error('List Ideas Error:', error);
    res.status(500).json({ error: 'Failed to retrieve ideas' });
  }
});

// Download idea kit PDF
router.get('/:ideaId/download-pdf', verifyToken, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const idea = ideas.get(ideaId);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    if (idea.walletAddress !== req.user.walletAddress) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Generate PDF
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const pdfPath = path.join(uploadsDir, `${ideaId}_kit.pdf`);
    
    await generateIdeaKitPDF(idea, pdfPath);

    res.download(pdfPath, `${idea.tokenData.tokenName}_IdeaKit.pdf`, (err) => {
      if (err) console.error('Download Error:', err);
      // Clean up file after download
      setTimeout(() => {
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
      }, 5000);
    });
  } catch (error) {
    console.error('Download PDF Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
