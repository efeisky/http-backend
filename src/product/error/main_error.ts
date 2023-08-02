import { Response } from 'express';

export enum MainErrorCode {
    IPNotFounded = 500
}
export enum MainErrorMessage {
    IPNotFounded = "IP Adresi alırken bir problem oluştu!"
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