// Sécurité et authentification
import { AES, enc } from 'crypto-js';

const SECRET_KEY = process.env.VITE_SECRET_KEY || 'default-secret-key';

export const encryptData = (data: string): string => {
  return AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(enc.Utf8);
};

export const generateTwoFactorCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};