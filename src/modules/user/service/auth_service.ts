import { Response } from "express";
import { SecurityService } from "../../../service/security_service";
import { TokenError, TokenErrorCode, TokenErrorMessage } from "../../../product/error/token_error";
import { TokenStructure } from "../../../product/constant/token_structure";
import { TokenTypes } from "../../../security/auth/token_type";
import { UserAuthModel } from "../models/user_auth_model";

interface IUserAuthService {
    checkAuth(res : Response, type : TokenTypes, user : UserAuthModel): Promise<void>;
}

export class UserAuthService implements IUserAuthService {
    private securityService = new SecurityService();
    private error = new TokenError();

    async checkAuth(res : Response, type : TokenTypes, user : UserAuthModel): Promise<void> {
        const data = await this.securityService.checkTokenValidation(res, user.token);
        if (data === false) {
            this.error.CreateError(res, TokenErrorCode.InvalidToken, TokenErrorMessage.InvalidToken);
            return;
        }
        const tokenData = new TokenStructure(data);
        
        if (tokenData.token_ip !== user.ip || tokenData.token_type !== type || tokenData.token_auth !== user.getRole()) {
            this.error.CreateError(res, TokenErrorCode.TokenVerifyError, TokenErrorMessage.TokenVerifyError);
            return;
        }

        if (new Date() > new Date(tokenData.token_age)) {
            this.error.CreateError(res, TokenErrorCode.TokenDateError, TokenErrorMessage.TokenDateError);
            return;
        }
    }
}
