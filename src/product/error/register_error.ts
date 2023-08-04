import { Response } from 'express';

export enum RegisterErrorCode {
    InvalidCredentials = 401,
    UnAvailableService = 503,
    RegisterUniqueError = 409,
    RegisterFailed = 500,
}
export enum RegisterErrorMessage {
    InvalidCredentials = "E-Mail ve şifre doğru yapıda olmalıdır!",
    UnAvailableService = "Servis geçici olarak kullanılamamaktadır!",
    RegisterUniqueError = "Belirtilen E-Mail adresi zaten bir hesaba kayıtlı!",
    RegisterFailed = "Register işlemi gerçekleşemedi!"
}

export class RegisterError{
    public CreateError(res : Response, code : RegisterErrorCode, message : RegisterErrorMessage) {
        return res
        .status(code)
        .send({
            apiStatus : false,
            error : message
        })
    }
}