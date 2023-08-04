import { Response } from "express";
import { AuthRoles } from "../../../security/auth/auth_role";
import { TokenError, TokenErrorCode, TokenErrorMessage } from "../../../product/error/token_error";
import { VerifyService } from "../service/verify_service";
import { TokenTypes } from "../../../security/auth/token_type";

export class VerifyModel {
    token : string;
    ip: string;
    role : AuthRoles
    
    private error = new TokenError()
    private service = new VerifyService()

    constructor(token : string, ip : string, res : Response) {
        if (token.length != 128) {
            this.error.CreateError(res, TokenErrorCode.InvalidToken, TokenErrorMessage.InvalidToken)
        }
        this.token = token;
        this.ip = ip;   
        this.role = AuthRoles.Part_Authorized;   
    }

    async checkTokenValidate(res : Response) {
        await this.service.checkToken(res, TokenTypes.Verify, this);
    }
    getRole() {
        return this.role;
    }
}
