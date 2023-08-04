import { Response } from "express";
import { RegisterModel } from "../models/register_model";
import { MailService } from "../../../service/mail_service";
import { SecurityService } from "../../../service/security_service";
import { RegisterConnection } from "../../../database/connection/register_connection";

interface IRegisterService {
    registerUser(user: RegisterModel, res : Response): Promise<void>;
    createUniqueID(): string;
}

export class RegisterService implements IRegisterService {
    private connection = new RegisterConnection();
    private mailService = new MailService();
    private securityService = new SecurityService();

    createUniqueID(): string {
        return this.securityService.CreateUUID();
    }

    async registerUser(user: RegisterModel, res : Response): Promise<void> {
        await this.connection.RegisterUser(user, res);

        //Hesap Doğrulama Maili Gönderme
        if (!user.verify_status) {
            const verifyToken = await this.securityService.createVerifyToken(res, user.ip, user.getVerifyMailRole(), user.unique_id);
            await this.mailService.sendVerifyEmail(user.email, user.location.city, user.location.country, verifyToken, res);
        }

        //Kullanıcı Tokenı Oluşturma
        const verifyToken = await this.securityService.createUserToken(res, user.ip, user.getAuthRole(), user.unique_id);
        const basedToken = Buffer.from(verifyToken, 'utf8').toString('base64');

        //Tokenı Kaydetme ve Requesti sonlandırma            
        this.securityService.createCookie(basedToken, res);
        res.status(200).send({
            apiStatus : true,
            response : {
                account_verify : user.verify_status,
                email : user.email,
                username : user.username,
            },
            response_time : new Date().toISOString()
        })
    }
}
