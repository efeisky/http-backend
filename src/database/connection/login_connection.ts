import { Response } from "express";
import { LoginModel } from "../../modules/login/models/login_model";
import RedisConfig from "../cache/redis_config";
import DatabaseConfig from "../config/database_config";
import UserModel from "./../Schema/user_schema";

export class LoginConnection {
    private db_connection = new DatabaseConfig();
    private redis_connection = new RedisConfig();

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
    
    async CheckIPAttemps(model :LoginModel, res : Response) {
        await this.redis_connection.connectClient(res);
        const attemp = await this.redis_connection.get(model.ip,res);
        return JSON.parse(attemp || '[{"date": "broken"}]');
    }

    async SetIPAttemp(model :LoginModel,filteredList : Array<{ date: string }>, res : Response) {
        await this.redis_connection.connectClient(res);
        const dateData = {
            "date" : new Date().toISOString()
        }
        filteredList.push(dateData)
        await this.redis_connection.set(model.ip,JSON.stringify(filteredList), res)
    }
}