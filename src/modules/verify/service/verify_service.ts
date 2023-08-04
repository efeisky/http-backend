import { Response } from "express";
import { SecurityService } from "../../../service/security_service";
import { TokenTypes } from "../../../security/auth/token_type";
import { VerifyModel } from "../models/verify_model";
import { TokenError, TokenErrorCode, TokenErrorMessage } from "../../../product/error/token_error";
import { TokenStructure } from "../../../product/constant/token_structure";
import { VerifyConnection } from "../../../database/connection/verify_connection";

interface IVerifyService {
    checkToken(res : Response, type : TokenTypes, user : VerifyModel): Promise<void>;
}

export class VerifyService implements IVerifyService {
    private securityService = new SecurityService();
    private connection = new VerifyConnection();
    private error = new TokenError();

    async checkToken(res : Response, type : TokenTypes, user : VerifyModel): Promise<void> {
        const data = await this.securityService.checkTokenValidation(res, user.token, type);
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

        const modifyStatus = await this.connection.SetVerify(tokenData.token_secret, true, res);
        if (!modifyStatus) {
            this.error.CreateError(res, TokenErrorCode.ServiceError, TokenErrorMessage.ServiceError);
            return;
        }
        await this.securityService.removeToken(tokenData.token_secret, res);

        res.status(200).send({
            apiStatus : true,
            response_time : new Date().toISOString()
        })
    }
}
