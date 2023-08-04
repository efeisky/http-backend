import { Response } from "express";
import DatabaseConfig from "../config/database_config";
import UserModel from "./../Schema/user_schema";

export class VerifyConnection {
    private db_connection = new DatabaseConfig();

    async SetVerify(id: string, status : boolean, res: Response) {
        await this.db_connection.connect(res);
        try {
            const modify = await UserModel.updateOne({unique_id : id}, { $set: {verify_status : status} });
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