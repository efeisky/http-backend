import * as crypto from 'crypto';

function encrypt(data: string, secretKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encryptedData = cipher.update(data, 'utf8', 'base64');
  encryptedData += cipher.final('base64');
  return `${iv.toString('base64')}:${encryptedData}`;
}

function decrypt(encryptedData: string, secretKey: string): string {
  const [ivString, encryptedString] = encryptedData.split(':');
  const iv = Buffer.from(ivString, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let decryptedData = decipher.update(encryptedString, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

export {
    encrypt,
    decrypt
}