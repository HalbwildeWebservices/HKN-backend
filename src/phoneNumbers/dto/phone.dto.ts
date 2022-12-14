import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, IsUUID, } from "class-validator";
import { ICreatePhoneNumberRequest, IPhoneNumber } from "hkn-common";
import { PhoneNumber } from "../models/phoneNumber.model";


export class CreatePhoneDto implements ICreatePhoneNumberRequest {
    @ApiProperty({example: "+49123456789", description: "Phone number with international prefix"})
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    number: string;

    @ApiProperty({example: "Home", description: "Usage description of phone number"})
    @IsNotEmpty()
    @IsString()
    description: string;
}


export class PatchPhoneDto extends CreatePhoneDto implements IPhoneNumber{  
    @ApiProperty({description: "phoneId", example: ''})
    @IsUUID(4)
    @IsNotEmpty()
    readonly phoneId: string;
}

export class PhoneResponseDto implements IPhoneNumber {
    phoneId: string;
    number: string;
    description: string;

    constructor(phone: PhoneNumber) {
        this.phoneId = phone.phoneId;
        this.number  = phone.number;
        this.description = phone.description
    }
}