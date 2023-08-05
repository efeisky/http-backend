import { Response } from "express";
import DatabaseConfig from "../config/database_config";
import UserModel from "../Schema/user_schema";

export class ResetConnection {
    private db_connection = new DatabaseConfig();

    async SetReset(id: string, res: Response) {
        await this.db_connection.connect(res);
        try {
            const modify = await UserModel.updateOne({unique_id : id}, {$set : {
                login_status : false
            }});
            if (modify.modifiedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false
        }
    }
}