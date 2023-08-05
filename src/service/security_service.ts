import { getTokenAgeAsDay, getTokenAgeAsMinute } from "../security/auth/auth_age";
import { createSalt,decrypt, encrypt, setUniqueID } from "../security/key/crypto";
import { CreateToken } from "../security/key/token";
import { Response } from "express";
import { TokenConnection } from "../database/connection/token_connection";
import { TokenCookieTypes, TokenTypes } from "../security/auth/token_type";
import { TokenStructure } from "../product/constant/token_structure";

export class SecurityService {
    private connection = new TokenConnection();
    
    public async createVerifyToken(res : Response,ip : string, role : string, secret : string): Promise<string> {
        const createdToken = CreateToken(64);
        const data = new TokenStructure({
            token_ip : ip,
            token_type : TokenTypes.Verify,
            token_auth : role,
            token_secret : secret,
            token_age : getTokenAgeAsMinute(5)
        }).toJSON();

        await this.connection.SetToken(createdToken, data, res);
        return createdToken;
    }
    public async createResetToken(res : Response,ip : string, role : string, secret : string): Promise<string> {
        const createdToken = CreateToken(32);
        const data = new TokenStructure({
            token_ip : ip,
            token_type : TokenTypes.Reset,
            token_auth : role,
            token_secret : secret,
            token_age : getTokenAgeAsDay(5)
        }).toJSON();

        await this.connection.SetToken(createdToken, data, res);
        return createdToken;
    }
    public async createUserToken(res : Response,ip : string, role : string, secret : string): Promise<string> {
        const createdToken = CreateToken(128);
        
        const data = new TokenStructure({
            token_ip : ip,
            token_type : TokenTypes.Auth,
            token_auth : role,
            token_secret : secret,
            token_age : getTokenAgeAsDay(30)
        }).toJSON();

        await this.connection.SetToken(createdToken, data, res);
        return createdToken;
    }

    public async checkTokenValidation(res : Response,token : string): Promise<any> {
        const data = await this.connection.GetToken(token, res);
        return data;
    }

    public createSalt(): Buffer {
        return createSalt();
    }

    public async encryptData(value : string, createdSalt : Buffer, secretKey : string): Promise<{ encryptedData: string; salt: string }> {
        return await encrypt(value, createdSalt, secretKey);
    }

    public async decryptData(value : string, salt : string, secretKey : string): Promise<string> {
        return await decrypt(value, salt, secretKey);
    }

    public createForgetPasswordData(authRole: string,secret : string, salt : Buffer): string {
        return JSON.stringify(
            {
                userAuthorization : authRole,
                userSecret: secret,
                expiredAge: new Date(Date.now() + 24 * 60 * 60 * 1000),
                userSalt: salt
            }
        );
    }
    public CreateUUID() : string {
        return setUniqueID()
    }
    public createCookie(token : string, res : Response) : void {
        const maxAge = 30 * 24 * 60 * 60 * 1000;
        res.cookie(TokenCookieTypes.SessionBased, token, { httpOnly: true, secure: true, maxAge: maxAge });
    }
    public async removeToken(token : string, res : Response) : Promise<void> {
        await this.connection.RemoveToken(token, res);
    }
}
