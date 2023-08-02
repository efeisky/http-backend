import { Response } from "express";
import { LoginConnection } from "../../../database/connection/login_connection";
import { LoginModel } from "../models/login_model";
import { LoginError, LoginErrorCode, LoginErrorMessage } from "../../../product/error/login_error";
import { MailService } from "../../service/mail_service";

interface ILoginService {
    loginUser(user: LoginModel, res : Response): Promise<void>;
    controlIP(user: LoginModel, res : Response): Promise<boolean>;
}

export class LoginService implements ILoginService {
    private connection = new LoginConnection();
    private mailService = new MailService();
    private error = new LoginError();

    async loginUser(user: LoginModel, res : Response): Promise<void> {
        const result = await this.connection.LoginUser(user, res);
        if (!result) {
            this.error.CreateError(res, LoginErrorCode.LoginFailed, LoginErrorMessage.LoginFailed);
        }else{
            if(user.location.city === result.city && user.location.country === result.country && result.verify_status && result.account_status){
                await this.mailService.sendInformationEmail(user.email, res);
                
                //Konum ile 'Bu sen misin?' Maili Gönderme
                if (result.login_status) {
                    await this.mailService.sendLocationEmail(user.email, res);
                }
                //Create Token
                //Auth And Finish
            }
            else{
                //Hesap Durumu Kontrolü
                if (!result.account_status) {
                    this.error.CreateError(res, LoginErrorCode.LoginFailed, LoginErrorMessage.LoginFailed);
                }

                //Create Verify Token

                //Hesap Doğrulama Maili Gönderme
                if (!result.verify_status) {
                    await this.mailService.sendVerifyEmail(user.email, res);
                }

                //Konum ile 'Bu sen misin?' Maili Gönderme
                if (result.login_status && (user.location.city !== result.city || user.location.country !== result.country)) {
                    await this.mailService.sendLocationEmail(user.email, res);
                }

                //Auth And Finish
            }
        }
    }
    
    async controlIP(user: LoginModel, res : Response): Promise<boolean> {
        const attemps : Array<{ date: string }> = await this.connection.CheckIPAttemps(user,res);
        if (attemps.length > 0) {
            if (attemps[0]['date'] === 'broken') {
                return false;
            }
            
            const currentTime = new Date().getTime();
            const tenMinutesInMilliseconds = 10 * 60 * 1000;
            const maxAttempts = 15;

            //Tarihten 10 dakika geçmişse sil
            const filteredList = attemps.filter((attempt) => {
                const attemptTime = new Date(attempt.date).getTime();
              
                const timeDifference = currentTime - attemptTime;
              
                return timeDifference <= tenMinutesInMilliseconds;
              });
            
            //Hak bittiyse girişi engelle
            if (filteredList.length >= maxAttempts) {
              this.error.CreateError(res, LoginErrorCode.TooManyAttempts, LoginErrorMessage.TooManyAttempts)
              return false;
            }
            await this.connection.SetIPAttemp(user,filteredList,res)
            return true;
        }
        return true;
    }

}
