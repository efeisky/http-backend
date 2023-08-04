import { Response } from "express";
import DatabaseConfig from "../config/database_config";
import UserModel from "./../Schema/user_schema";
import { RegisterModel } from "../../modules/register/models/register_model";
import { RegisterError, RegisterErrorCode, RegisterErrorMessage } from "../../product/error/register_error";

export class RegisterConnection {
    private db_connection = new DatabaseConfig();
    private error = new RegisterError();

    async RegisterUser(model: RegisterModel, res: Response) {
        
        try {
            await this.db_connection.connect(res);
            const existingUser = await UserModel.findOne({ email : model.email });

            if (existingUser) {
                this.error.CreateError(res, RegisterErrorCode.RegisterUniqueError, RegisterErrorMessage.RegisterUniqueError);
                return;
            } else {
                const newUser = new UserModel({
                    username : model.username,
                    email : model.email,
                    password : model.password,
                    city : model.location.city,
                    country : model.location.country,
                    account_status : model.account_status,
                    verify_status : model.verify_status,
                    login_status : model.login_status,
                    unique_id : model.unique_id,
                    create_date : model.create_date,
                });
                await newUser.save();
            }
        } catch (err) {
            this.error.CreateError(res, RegisterErrorCode.RegisterFailed, RegisterErrorMessage.RegisterFailed);
            return;
        }
    }
}