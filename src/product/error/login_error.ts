import { Response } from 'express';

export enum LoginErrorCode {
    InvalidCredentials = 401,
    TooManyAttempts = 429,
    UnAvailableService = 500,
    LoginFailed = 401,
}
export enum LoginErrorMessage {
    InvalidCredentials = "E-Mail ve şifre doğru yapıda olmalıdır!",
    TooManyAttempts = "Birden çok kez deneme. Hesap 10 dakika kilitlendi",
    UnAvailableService = "Servis geçici olarak kullanılamamaktadır!",
    LoginFailed = "Login işlemi gerçekleşemedi!"
}

export class LoginError{
    public CreateError(res : Response, code : LoginErrorCode, message : LoginErrorMessage) {
        return res
        .status(code)
        .send({
            apiStatus : false,
            error : message
        })
    }
}