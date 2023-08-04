import {createClient} from "redis";
import { Response } from "express";
import { MainError, MainErrorCode, MainErrorMessage } from "../../product/error/main_error";

class RedisConfig {
    private client: any;
    private error = new MainError()
    private createError(res : Response) {
        this.error.CreateError(res, MainErrorCode.RedisServiceError, MainErrorMessage.RedisServiceError);
        return;
    }
    public connectClient(res : Response) {
        try {
            this.client = createClient({
                password: 'hmldd7pINQAr1y8eP11v7eQRcfoo9tbr',
                socket: {
                    host: 'redis-17284.c17.us-east-1-4.ec2.cloud.redislabs.com',
                    port: 17284
                }
            });

        } catch (err) {
            this.createError(res)
        }
    }

    public async get(key : string, res : Response) {
        try {
            await this.client.connect();
            
            const value = await this.client.get(key);

            await this.client.disconnect();

            return value;
        } catch (err) {
            this.createError(res)
        }
    }

    public async set(key : string, value : string, res : Response) {
        try {
            await this.client.connect();
            
            await this.client.set(key, value);

            await this.client.disconnect();

        } catch (err) {
            this.createError(res)
        }
    }

    public async delete(key : string, res : Response) {
        try {
            await this.client.connect();
            
            await this.client.del(key);

            await this.client.disconnect();

        } catch (err) {
            this.createError(res)
        }
    }
}


export default RedisConfig;