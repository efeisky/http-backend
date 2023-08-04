import * as crypto from 'crypto';
function createSalt() {
  return crypto.randomBytes(16);
}
async function generateSecretKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

async function encrypt(data: string,createdSalt : Buffer, password: string): Promise<{ encryptedData: string; salt: string }> {
  const secretKey = await generateSecretKey(password, createdSalt);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encryptedData = cipher.update(data, 'utf8', 'base64');
  encryptedData += cipher.final('base64');
  return { encryptedData: `${iv.toString('base64')}:${createdSalt.toString('base64')}:${encryptedData}`, salt: createdSalt.toString('base64') };
}

async function decrypt(encryptedData: string, userSalt: string, password: string,): Promise<string> {
  const [ivString, saltString, encryptedString] = encryptedData.split(':');
  const iv = Buffer.from(ivString, 'base64');
  const salt = Buffer.from(userSalt, 'base64');
  const secretKey = await generateSecretKey(password, salt);
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decryptedData = decipher.update(encryptedString, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}
function setUniqueID(): string {
  return crypto.randomUUID();
}

export { createSalt, encrypt, decrypt, setUniqueID };
