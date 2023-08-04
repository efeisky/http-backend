import { Response } from "express";
import { MainErrorCode, MainError, MainErrorMessage } from "../product/error/main_error";
import { IpConnection } from "../database/connection/ip_connection";

export class IpService{
    private error = new MainError();
    private connection = new IpConnection();

    async controlIP(userIp: string, res : Response): Promise<boolean> {
        const attemps : Array<{ date: string }> = await this.connection.CheckIPAttemps(userIp,res);
        if (attemps.length > 0) {
            if (attemps[0]['date'] === 'broken') {
                return false;
            }
            
            const currentTime = new Date().getTime();
            const tenMinutesInMilliseconds = 10 * 60 * 1000;
            const maxAttempts = 15;

            //Tarihten 10 dakika geçmişse sil
            const filteredList = attemps.filter((attempt) => {
                const attemptTime = new Date(attempt.date).getTime();
              
                const timeDifference = currentTime - attemptTime;
              
                return timeDifference <= tenMinutesInMilliseconds;
              });
            
            //Hak bittiyse girişi engelle
            if (filteredList.length >= maxAttempts) {
              this.error.CreateError(res, MainErrorCode.TooManyAttempts, MainErrorMessage.TooManyAttempts)
              return false;
            }
            await this.connection.SetIPAttemp(userIp,filteredList,res)
            return true;
        }
        return true;
    }
}
