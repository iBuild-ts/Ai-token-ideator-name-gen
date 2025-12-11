import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateTokenBranding = async (projectIdea) => {
  try {
    const prompt = `You are an expert crypto branding specialist. Based on the following project idea, generate:
1. A unique, catchy token name (2-3 words, memorable)
2. A short ticker symbol (3-5 characters, uppercase)
3. A brief tagline (max 10 words)
4. A color palette suggestion (3-4 hex colors)
5. A visual style description (for logo design)

Project Idea: "${projectIdea}"

Respond in JSON format:
{
  "tokenName": "string",
  "symbol": "string",
  "tagline": "string",
  "colors": ["#hex1", "#hex2", "#hex3"],
  "visualStyle": "string",
  "description": "string"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a crypto branding expert. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error(`Failed to generate token branding: ${error.message}`);
  }
};

export const generateLogoPrompt = async (tokenData) => {
  try {
    const prompt = `Create a detailed DALL-E prompt for a crypto token logo with these specifications:
- Token Name: ${tokenData.tokenName}
- Symbol: ${tokenData.symbol}
- Visual Style: ${tokenData.visualStyle}
- Colors: ${tokenData.colors.join(', ')}
- Tagline: ${tokenData.tagline}

Generate a concise, creative DALL-E prompt that would produce a professional, memorable crypto token logo.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Logo Prompt Generation Error:', error);
    throw new Error(`Failed to generate logo prompt: ${error.message}`);
  }
};

export const generateProjectDescription = async (projectIdea, tokenData) => {
  try {
    const prompt = `Based on this crypto project idea and generated token branding, create a compelling project description:

Project Idea: "${projectIdea}"
Token Name: ${tokenData.tokenName}
Symbol: ${tokenData.symbol}
Tagline: ${tokenData.tagline}

Write a 2-3 paragraph project description that:
1. Explains the project's purpose
2. Highlights the token's utility
3. Appeals to potential investors
4. Is professional yet engaging`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Description Generation Error:', error);
    throw new Error(`Failed to generate project description: ${error.message}`);
  }
};
