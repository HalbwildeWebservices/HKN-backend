import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { IPhoneNumber } from "hkn-common";


export class CreatePhoneDto implements Partial<IPhoneNumber>{
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