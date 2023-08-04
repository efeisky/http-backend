import { Response } from 'express';

export enum LoginErrorCode {
    InvalidCredentials = 401,
    UnAvailableService = 500,
    LoginFailed = 401,
}
export enum LoginErrorMessage {
    InvalidCredentials = "Username, E-Mail ve Şifre doğru yapıda olmalıdır!",
    UnAvailableService = "Servis geçici olarak kullanılamamaktadır!",
    LoginFailed = "Kayıt işlemi gerçekleşemedi!"
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