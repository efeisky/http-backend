const crypto = require('crypto');

function CreateToken(digitCount : number) {
    return crypto.randomBytes(digitCount).toString('hex');
}
  
export { CreateToken };
  