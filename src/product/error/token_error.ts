import { Response } from 'express';

export enum TokenErrorCode {
    InvalidToken = 401,
    TokenVerifyError = 401,
    TokenDateError = 401,
    ServiceError = 500,
}
export enum TokenErrorMessage {
    InvalidToken = "Geçersiz Token!",
    TokenVerifyError = "Token doğrulaması sırasında bir hata gerçekleşti!",
    TokenDateError = "Tokenın zamanı geçmiş tekrardan giriş yaparak yeniden deneyiniz!",
    ServiceError = "Sistemsel bir hata gerçekleşti. Lütfen daha sonra tekrar deneyiniz!",
}

export class TokenError{
    public CreateError(res : Response, code : TokenErrorCode, message : TokenErrorMessage) {
        return res
        .status(code)
        .send({
            apiStatus : false,
            error : message
        })
    }
}