import { Response } from "express";
import { SecurityService } from "../../../service/security_service";
import { ResetModel } from "../models/reset_model";
import { TokenError, TokenErrorCode, TokenErrorMessage } from "../../../product/error/token_error";
import { TokenStructure } from "../../../product/constant/token_structure";
import { TokenTypes } from "../../../security/auth/token_type";
import { ResetConnection } from "../../../database/connection/reset_connection";

interface IResetService {
    checkToken(res : Response, type : TokenTypes, user : ResetModel): Promise<void>;
}

export class ResetService implements IResetService {
    private securityService = new SecurityService();
    private connection = new ResetConnection();
    private error = new TokenError();

    async checkToken(res : Response, type : TokenTypes, user : ResetModel): Promise<void> {
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

        const modifyStatus = await this.connection.SetReset(tokenData.token_secret, res);
        if (!modifyStatus) {
            this.error.CreateError(res, TokenErrorCode.ServiceError, TokenErrorMessage.ServiceError);
            return;
        }
        await this.securityService.removeToken(user.token, res);

        res.status(200).send({
            apiStatus : true,
            response_time : new Date().toISOString()
        })
    }
}
