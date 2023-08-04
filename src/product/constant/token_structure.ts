export class TokenStructure {
    token_ip: string;
    token_type: string;
    token_auth: string;
    token_secret: string;
    token_age: Date;
  
    constructor(data: any) {
      this.token_ip = data.token_ip || '';
      this.token_type = data.token_type || '';
      this.token_auth = data.token_auth || '';
      this.token_secret = data.token_secret || '';
      this.token_age = new Date(data.token_age) || new Date();
    }
  
    toJSON(): object {
      return {
        token_ip: this.token_ip,
        token_type: this.token_type,
        token_auth: this.token_auth,
        token_secret: this.token_secret,
        token_age: this.token_age
      };
    }
  }
  