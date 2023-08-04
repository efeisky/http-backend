import { Response } from 'express';

export enum MainErrorCode {
    IPNotFounded = 500,
    EmailServiceError = 500,
    RedisServiceError = 500,
    TooManyAttempts = 429
}
export enum MainErrorMessage {
    IPNotFounded = "IP Adresi alırken bir problem oluştu!",
    EmailServiceError = "E-Mail gönderirken bir problem oluştu!",
    RedisServiceError = "Servis geçici olarak kullanılamamaktadır!",
    TooManyAttempts = "Birden çok kez deneme. Hesap 10 dakika kilitlendi"
}

export class MainError{
    public CreateError(res : Response, code : MainErrorCode, message : MainErrorMessage) {
        return res
        .status(code)
        .send({
            apiStatus : false,
            error : message
        })
    }
}