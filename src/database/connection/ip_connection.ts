import { Response } from "express";
import RedisConfig from "../cache/redis_config";

export class IpConnection {
    private redis_connection = new RedisConfig();
    
    async CheckIPAttemps(ip :string, res : Response) {
        this.redis_connection.connectClient(res);
        const attemp = await this.redis_connection.get(ip,res);
        return JSON.parse(attemp || '[{"date": "broken"}]');
    }

    async SetIPAttemp(ip :string,filteredList : Array<{ date: string }>, res : Response) {
        this.redis_connection.connectClient(res);
        const dateData = {
            "date" : new Date().toISOString()
        }
        filteredList.push(dateData)
        await this.redis_connection.set(ip,JSON.stringify(filteredList), res)
    }
}