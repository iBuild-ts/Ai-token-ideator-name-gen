import axios from 'axios';

const COINMARKETCAP_API = 'https://pro-api.coinmarketcap.com/v1';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const checkTokenUniqueness = async (tokenName, symbol) => {
  try {
    // Check CoinGecko (free API, no key required)
    const coingeckoResponse = await axios.get(
      `${COINGECKO_API}/search?query=${encodeURIComponent(tokenName)}`
    );

    const existingTokens = coingeckoResponse.data.coins || [];
    
    // Check if exact match exists
    const exactMatch = existingTokens.find(
      token => token.symbol.toUpperCase() === symbol.toUpperCase() ||
               token.name.toLowerCase() === tokenName.toLowerCase()
    );

    if (exactMatch) {
      return {
        isUnique: false,
        conflicts: [
          {
            name: exactMatch.name,
            symbol: exactMatch.symbol,
            id: exactMatch.id
          }
        ],
        message: `Token name or symbol already exists: ${exactMatch.name} (${exactMatch.symbol})`
      };
    }

    // Check for similar symbols
    const similarSymbols = existingTokens.filter(
      token => token.symbol.toUpperCase() === symbol.toUpperCase()
    );

    if (similarSymbols.length > 0) {
      return {
        isUnique: false,
        conflicts: similarSymbols.map(token => ({
          name: token.name,
          symbol: token.symbol,
          id: token.id
        })),
        message: `Symbol already in use by: ${similarSymbols.map(t => t.name).join(', ')}`
      };
    }

    return {
      isUnique: true,
      conflicts: [],
      message: 'Token name and symbol are unique!'
    };
  } catch (error) {
    console.error('Token Checker Error:', error);
    // Return success if API fails to avoid blocking the user
    return {
      isUnique: true,
      conflicts: [],
      message: 'Could not verify uniqueness (API unavailable), but proceeding with generation',
      warning: true
    };
  }
};

export const getTokenMetadata = async (symbol) => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/search?query=${encodeURIComponent(symbol)}`
    );

    const tokens = response.data.coins || [];
    const match = tokens.find(t => t.symbol.toUpperCase() === symbol.toUpperCase());

    if (match) {
      return {
        found: true,
        data: {
          name: match.name,
          symbol: match.symbol,
          image: match.large,
          marketCap: match.market_cap_rank,
          id: match.id
        }
      };
    }

    return { found: false };
  } catch (error) {
    console.error('Get Token Metadata Error:', error);
    return { found: false, error: error.message };
  }
};
