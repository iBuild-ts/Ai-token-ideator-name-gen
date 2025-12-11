import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

export const encryptData = (data, encryptionKey) => {
  try {
    const key = Buffer.from(encryptionKey, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted
    };
  } catch (error) {
    console.error('Encryption Error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = (encryptedObject, encryptionKey) => {
  try {
    const key = Buffer.from(encryptionKey, 'hex');
    const iv = Buffer.from(encryptedObject.iv, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encryptedObject.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption Error:', error);
    throw new Error('Failed to decrypt data');
  }
};

export const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashWalletAddress = (address) => {
  return crypto.createHash('sha256').update(address.toLowerCase()).digest('hex');
};
