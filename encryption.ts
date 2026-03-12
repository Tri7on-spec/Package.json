let sessionSalt = '';

export const generateSessionSalt = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  sessionSalt = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return sessionSalt;
};

export const getSessionSalt = (): string => {
  if (!sessionSalt) {
    generateSessionSalt();
  }
  return sessionSalt;
};

export const encryptMessage = (text: string): string => {
  const salt = getSessionSalt();
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const saltChar = salt.charCodeAt(i % salt.length);
    const shifted = (charCode + saltChar) % 94 + 33;
    result += String.fromCharCode(shifted);
  }
  
  return `🔒 ${result.substring(0, 20)}...`;
};

export const decryptMessage = (encrypted: string): string => {
  const salt = getSessionSalt();
  const cleanText = encrypted.replace('🔒 ', '').replace('...', '');
  let result = '';
  
  for (let i = 0; i < cleanText.length; i++) {
    const charCode = cleanText.charCodeAt(i);
    const saltChar = salt.charCodeAt(i % salt.length);
    const shifted = ((charCode - 33 - saltChar) % 94 + 94) % 94 + 33;
    result += String.fromCharCode(shifted);
  }
  
  return result;
};
