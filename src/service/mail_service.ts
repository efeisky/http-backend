import { Response } from "express";
import { MainErrorCode, MainError, MainErrorMessage } from "../product/error/main_error";
import mailer from "nodemailer";
import path from "path";
import { LoginModel } from "../modules/login/models/login_model";
import { FileService } from "./file_service";
import { SecurityService } from "./security_service";

interface IMailService {
    sendLocationEmail(user: LoginModel,token : string, res: Response<any, Record<string, any>>): Promise<void>;
    sendVerifyEmail(email : string, city : string, country : string,token : string, res: Response<any, Record<string, any>>): Promise<void>;
}

export class MailService implements IMailService {
    private transporter: mailer.Transporter;
    private error = new MainError();
    private securityService = new SecurityService();
    constructor() {
        this.transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'isik.efe017@gmail.com',
                pass: 'alujjlrlpcmjwgdl'
            }
        });
    }
    async sendVerifyEmail(email : string, city : string, country : string,token : string, res: Response<any, Record<string, any>>): Promise<void> {
        try {
            
            const link = `http://localhost:3000/api/oauth/verify?token=${token}`;
            
            const emailContentPath = path.join(process.cwd(), 'src', 'email', 'verify', 'email_content.html');
            const emailContent = await FileService.readFile(emailContentPath, email, city, country, link);
    
            const emailStylePath = path.join(process.cwd(), 'src', 'email', 'verify', 'email_content.css');
            const emailStyle = await FileService.readFile(emailStylePath, email, city, country);
            
            const combinedEmailContent = this.getCombainedMailSubject(emailContent, emailStyle);
            
            await this.sendMail('Hesaba Doğrulama İsteği',email, combinedEmailContent, res);
        } catch (error) {
            this.error.CreateError(res, MainErrorCode.EmailServiceError, MainErrorMessage.EmailServiceError);
            return;
        }
    }

    async sendLocationEmail(user: LoginModel,token : string, res: Response<any, Record<string, any>>): Promise<void> {
        try {
            const link = `http://localhost:3000/api/oauth/reset?token=${token}`;
            
            const emailContentPath = path.join(process.cwd(), 'src', 'email', 'location', 'email_content.html');
            const emailContent = await FileService.readFile(emailContentPath, user.email, user.location.city, user.location.country, link);
    
            const emailStylePath = path.join(process.cwd(), 'src', 'email', 'location', 'email_content.css');
            const emailStyle = await FileService.readFile(emailStylePath, user.email, user.location.city, user.location.country);
            
            const combinedEmailContent = this.getCombainedMailSubject(emailContent, emailStyle);
            
            await this.sendMail('Hesaba Giriş İşlemi Gerçekleşti',user.email, combinedEmailContent, res);
        } catch (error) {
            this.error.CreateError(res, MainErrorCode.EmailServiceError, MainErrorMessage.EmailServiceError);
            return;
        }
    }

    private async sendMail(subject : string, email: string, combinedEmailContent: string, res: Response<any, Record<string, any>>) {
        const emailResult = await this.transporter.sendMail({
            from: 'HTTP Backend <isik.efe017@gmail.com>',
            to: email,
            subject: subject,
            html: combinedEmailContent,
        });

        if (emailResult.accepted && emailResult.accepted.length > 0) {
        } else {
            this.error.CreateError(res, MainErrorCode.EmailServiceError, MainErrorMessage.EmailServiceError);
            return;
        }
    }

    private getCombainedMailSubject(body : string, style : string) : string {
        return `
            <html>
            <head>
                <style>
                    ${style}
                </style>
            </head>
            <body>
                ${body}
            </body>
            </html>
        `;
    }
}