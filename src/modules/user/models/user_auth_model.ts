import { Response } from "express";
import { AuthRoles } from "../../../security/auth/auth_role";
import { TokenError, TokenErrorCode, TokenErrorMessage } from "../../../product/error/token_error";
import { TokenTypes } from "../../../security/auth/token_type";
import { UserAuthService } from "../service/auth_service";

export class UserAuthModel {
    token : string;
    ip: string;
    role : AuthRoles

    private error = new TokenError()
    private authService = new UserAuthService()

    constructor(token : string, ip : string, res : Response) {
        const basedToken = Buffer.from(token, 'base64').toString('utf8');
        if (!basedToken) {
            this.error.CreateError(res, TokenErrorCode.InvalidToken, TokenErrorMessage.InvalidToken)
        }
        this.token = basedToken;
        this.ip = ip;    
        this.role = AuthRoles.User;  
    }
    
    async checkTokenValidate(res : Response) {
        await this.authService.checkAuth(res, TokenTypes.Auth, this);
    }
    getRole() {
        return this.role;
    }
}
