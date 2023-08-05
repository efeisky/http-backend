import { Response } from "express";
import { AuthRoles } from "../../../security/auth/auth_role";
import { ResetService } from "../service/reset_service";
import { TokenError, TokenErrorCode, TokenErrorMessage } from "../../../product/error/token_error";
import { TokenTypes } from "../../../security/auth/token_type";
export class ResetModel {
    token : string;
    ip: string;
    role : AuthRoles

    private error = new TokenError()
    private service = new ResetService()

    constructor(token : string, ip : string, res : Response) {
        if (token.length === 0) {
            this.error.CreateError(res, TokenErrorCode.InvalidCredentials, TokenErrorMessage.InvalidCredentials)
        }
        this.token = token;
        this.ip = ip;    
        this.role = AuthRoles.Part_Authorized;  
    }
    
    async checkTokenValidate(res : Response) {
        await this.service.checkToken(res, TokenTypes.Reset, this);
    }
    getRole() {
        return this.role;
    }
}
