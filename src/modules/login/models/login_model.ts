import { Response } from "express";
import { LoginError, LoginErrorCode, LoginErrorMessage } from "../../../product/error/login_error";
import { AuthRoles } from "../../../security/auth/auth_role";
import { LoginService } from "../service/login_service";
import { LocationService } from "../../../service/location_service";
import { isEmail, isPassword } from "../../../product/regex/regex";
import { IpService } from "../../../service/ip_service";
export class LoginModel {
    email: string;
    password: string;
    ip: string;
    location: { city: string; country: string; };

    private service = new LoginService();
    private locationService = new LocationService();
    private ipService = new IpService();
    
    private error = new LoginError()

    constructor(email: string, password: string, ip : string, res : Response) {
        if (!isEmail(email) && !isPassword(email)) {
            this.error.CreateError(res, LoginErrorCode.InvalidCredentials, LoginErrorMessage.InvalidCredentials);
            this.email = '';
            this.password = '';   
            this.ip = '';   
            this.location = { city: '', country: '' }; 
            return;
        }
        this.email = email;
        this.password = password;   
        this.ip = ip;   
        this.location = { city: '', country: '' }; 
    }

    async authenticate(res : Response) {
        const {city, country} = await this.locationService.getLocation(this.ip, res);
        this.location = {
            city : city,
            country : country
        }
        await this.service.loginUser(this, res)
    }
    
    async controlIPAdress(res : Response) {
        return await this.ipService.controlIP(this.ip, res);
    }

    getRole() {
        return AuthRoles.Not_Authorized;
    }
    getLocationMailRole() {
        return AuthRoles.Part_Authorized;
    }
    getVerifyMailRole() {
        return AuthRoles.Part_Authorized;
    }
    getAuthRole() {
        return AuthRoles.User;
    }
}
