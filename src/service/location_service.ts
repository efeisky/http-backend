import axios from "axios";
import { Response } from "express";
import { MainErrorCode, MainError, MainErrorMessage } from "../product/error/main_error";

interface ILocationService {
    getLocation(ip : string, res : Response): Promise<{city : string, country : string}>;
}

export class LocationService implements ILocationService {
    private error = new MainError();

    async getLocation(ip: string, res: Response<any, Record<string, any>>): Promise<{city : string, country : string}> {

        //TODO : APİ IP Adresi Seçilecek ipden alacak
        const token = 'fdc05c92530e5f'
        const apiUrl = `https://ipinfo.io/${ip}/json?token=${token}`;
        try {
            const response = await axios.get(apiUrl);
            const { city, country } = response.data;
            return {city, country}
          } catch (error) {
            this.error.CreateError(res, MainErrorCode.IPNotFounded, MainErrorMessage.IPNotFounded);
            return {city: '', country: ''}
          }
    }

}
