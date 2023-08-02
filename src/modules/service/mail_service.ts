import { Response } from "express";
import { MainErrorCode, MainError, MainErrorMessage } from "../../product/error/main_error";
import mailer from "nodemailer";

interface IMailService {
    sendInformationEmail(email : String, res : Response): Promise<void>;
    sendLocationEmail(email : String, res : Response): Promise<void>;
    sendVerifyEmail(email : String, res : Response): Promise<void>;
}

export class MailService implements IMailService {
    private transporter: mailer.Transporter;
    private error = new MainError();

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
    async sendLocationEmail(email: String, res: Response<any, Record<string, any>>): Promise<void> {
        console.log('location mail gönderiliyor..');
    }

    async sendVerifyEmail(email: string, res: Response<any, Record<string, any>>): Promise<void> {
        console.log('verify mail gönderiliyor..');
    }

    async sendInformationEmail(email: string, res: Response<any, Record<string, any>>): Promise<void> {
        console.log('information mail gönderiliyor..');
    }

}