import { Response } from "express";
import { LoginModel } from "../../modules/login/models/login_model";
import RedisConfig from "../cache/redis_config";
import DatabaseConfig from "../config/database_config";
import UserModel from "./../Schema/user_schema";

export class LoginConnection {
    private db_connection = new DatabaseConfig();

    async LoginUser(model: LoginModel, res: Response) {
        await this.db_connection.connect(res);
        try {
            const { email, password } = model;
            const user = await UserModel.findOne({ email, password });
            if (user) {
                return user;
            }else{
                return false;
            }
        } catch (err) {
            return false
        }
    }

    async setLoginStatus(id: string, status : boolean, res: Response) {
        await this.db_connection.connect(res);
        try {
            const modify = await UserModel.updateOne({unique_id : id}, { $set: {login_status : status} });
            if (modify.modifiedCount > 0) {
                return true;
            }else{
                return false;
            }
        } catch (err) {
            return false
        }
    }
}