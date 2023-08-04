import mongoose from "mongoose";
import { LoginError, LoginErrorCode, LoginErrorMessage } from "../../product/error/login_error";
import { Response } from "express";

class DatabaseConfig {
    static dbUrl: string = 'mongodb+srv://root:oOYn6STW2YatCiR2@cluster0.eeytlwk.mongodb.net/?retryWrites=true&w=majority';
    private error = new LoginError()
    private createError(res : Response) {
        this.error.CreateError(res, LoginErrorCode.UnAvailableService, LoginErrorMessage.UnAvailableService);
        return;
    }
    public async connect(res : Response) {
        try {
            await mongoose.connect(DatabaseConfig.dbUrl);
        } catch (err) {
            this.createError(res)
        }
    }
}


export default DatabaseConfig;
