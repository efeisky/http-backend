import { Response } from "express";
import RedisConfig from "./../cache/redis_config";

export class TokenConnection {
    private redis_connection = new RedisConfig();

    async SetToken(token : string, data: object, res: Response) {
        this.redis_connection.connectClient(res);
        await this.redis_connection.set(token, JSON.stringify(data), res)
    }

    async GetToken(token : string, res: Response) {
        this.redis_connection.connectClient(res);
        const tokenData = await this.redis_connection.get(token, res);
        if (tokenData) {
            return JSON.parse(tokenData)
        }
        return false;
    }

    async RemoveToken(token : string, res: Response) {
        this.redis_connection.connectClient(res);
        await this.redis_connection.delete(token, res);
        return false;
    }
}