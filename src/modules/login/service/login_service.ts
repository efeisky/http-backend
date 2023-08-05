import { Response } from "express";
import { LoginConnection } from "../../../database/connection/login_connection";
import { LoginModel } from "../models/login_model";
import { LoginError, LoginErrorCode, LoginErrorMessage } from "../../../product/error/login_error";
import { MailService } from "../../../service/mail_service";
import { SecurityService } from "../../../service/security_service";

interface ILoginService {
    loginUser(user: LoginModel, res : Response): Promise<void>;
}

export class LoginService implements ILoginService {
    private connection = new LoginConnection();
    private mailService = new MailService();
    private securityService = new SecurityService();
    private error = new LoginError();

    async loginUser(user: LoginModel, res : Response): Promise<void> {
        const result = await this.connection.LoginUser(user, res);
        if (!result) {
            this.error.CreateError(res, LoginErrorCode.LoginFailed, LoginErrorMessage.LoginFailed);
            return;
        }else{
            if(user.location.city === result.city && user.location.country === result.country && result.verify_status && result.account_status){
                //Konum ile 'Bu sen misin?' Maili Gönderme
                if (result.login_status) {
                    const locationToken = await this.securityService.createResetToken(res, user.ip, user.getLocationMailRole(), result.unique_id);
                    await this.mailService.sendLocationEmail(user, locationToken, res);
                }
            }
            else{
                //Hesap Durumu Kontrolü
                if (!result.account_status) {
                    this.error.CreateError(res, LoginErrorCode.LoginFailed, LoginErrorMessage.LoginFailed);
                    return;
                }


                //Hesap Doğrulama Maili Gönderme
                if (!result.verify_status) {
                    const verifyToken = await this.securityService.createVerifyToken(res, user.ip, user.getVerifyMailRole(), result.unique_id);
                    await this.mailService.sendVerifyEmail(user.email, user.location.city, user.location.country, verifyToken, res);
                }

                //Konum ile 'Bu sen misin?' Maili Gönderme
                if (result.login_status && (user.location.city !== result.city || user.location.country !== result.country)) {
                    const locationToken = await this.securityService.createResetToken(res, user.ip, user.getLocationMailRole(), result.unique_id);
                    await this.mailService.sendLocationEmail(user, locationToken, res);
                }
            }

            //Login Status Güncelleme
            if (!result.login_status) {
                const modifyStatus = await this.connection.setLoginStatus(result.unique_id, true, res);
                if (!modifyStatus) {
                    this.error.CreateError(res, LoginErrorCode.UnAvailableService, LoginErrorMessage.UnAvailableService);
                    return;
                }
            }

            //Kullanıcı Tokenı Oluşturma
            const verifyToken = await this.securityService.createUserToken(res, user.ip, user.getAuthRole(), result.unique_id);
            const basedToken = Buffer.from(verifyToken, 'utf8').toString('base64');

            this.securityService.createCookie(basedToken, res);
            //Tokenı Kaydetme ve Requesti sonlandırma
            res.status(200).send({
                apiStatus : true,
                response : {
                    account_verify : result.verify_status,
                    email : result.email,
                    username : result.username,
                },
                response_time : new Date().toISOString()
            })
        }
    }
}
