import { Exclude } from "class-transformer";
import { IUserResponse } from "hkn-common";
import { PermissionResponseDto } from "src/permissions/dto/permissions.dto";
import { PhoneResponseDto } from "src/phoneNumbers/dto/phone.dto";
import { AdressResponseDto } from "src/users/dto/create-address.dto"
//import { UserPermission } from "src/permissions/models/permissions.model";
import { User } from "../models/user.model";

export class UserResponseDto implements IUserResponse {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    email: string;
    permissions: PermissionResponseDto[];
    address: AdressResponseDto;
    phoneNumbers: PhoneResponseDto[];
    createdAt: string;
    updatedAt: string;

    @Exclude()
    password: string;

    constructor(user: User) {
        const values = user.get();
        const {address, phoneNumbers, permissions, ...rest} = values 
        Object.assign(this, rest);
        this.address = new AdressResponseDto(user.address);
        this.permissions = user.permissions.map((p) => new PermissionResponseDto(p));
        this.phoneNumbers = user.phoneNumbers.map((p) => new PhoneResponseDto(p));
    }

}