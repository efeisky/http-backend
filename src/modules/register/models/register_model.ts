import { Response } from "express";
import { LoginError, LoginErrorCode, LoginErrorMessage } from "../../../product/error/login_error";
import { AuthRoles } from "../../../security/auth/auth_role";
import { RegisterService } from "../service/register_service";
import { LocationService } from "../../../service/location_service";
import { isEmail, isPassword, isUsername } from "../../../product/regex/regex";
import { IpService } from "../../../service/ip_service";
export class RegisterModel {
    username : string;
    email: string;
    password: string;
    ip: string;
    unique_id: string;
    verify_status: boolean;
    account_status: boolean;
    login_status: boolean;
    create_date: Date;
    location: { city: string; country: string; };

    private service = new RegisterService();
    private locationService = new LocationService();
    private ipService = new IpService();
    
    private error = new LoginError()

    constructor(username : string, email: string, password: string, ip : string, res : Response) {
        this.create_date = new Date();
        this.unique_id = this.service.createUniqueID();
        this.verify_status = false;
        this.account_status = true;
        this.login_status = true;
        this.location = { city: '', country: '' }; 
        this.ip = ip;   
        if (isUsername(username) && isEmail(email) && isPassword(password)) {
            this.username = username;
            this.email = email;
            this.password = password;
            return;
        }
        this.error.CreateError(res, LoginErrorCode.InvalidCredentials, LoginErrorMessage.InvalidCredentials);
        this.username = '';
        this.email = '';
        this.password = '';
    }

    async create(res : Response) {
        const {city, country} = await this.locationService.getLocation(this.ip, res);
        this.location = {
            city : city,
            country : country
        }
        await this.service.registerUser(this, res)
    }
    
    async controlIPAdress(res : Response) {
        return await this.ipService.controlIP(this.ip, res);
    }

    getRole() {
        return AuthRoles.Not_Authorized;
    }
    getVerifyMailRole() {
        return AuthRoles.Part_Authorized;
    }
    getAuthRole() {
        return AuthRoles.User;
    }
}
